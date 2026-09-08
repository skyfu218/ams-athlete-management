#!/usr/bin/env python3
"""Convert official 113 National High School Games final-result HTML to TS data."""
from __future__ import annotations

import html
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path


class ResultParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.rows, self.row, self.cell = [], None, None
        self.segment = None

    def handle_starttag(self, tag, attrs):
        if tag == "tr":
            self.row = []
        elif tag == "td" and self.row is not None:
            self.cell = {"plain": [], "segments": []}
            self.segment = None
        elif tag == "font" and self.cell is not None:
            self.segment = []
            self.cell["segments"].append(self.segment)

    def handle_data(self, data):
        if self.cell is None:
            return
        value = " ".join(html.unescape(data).split())
        if not value:
            return
        (self.segment if self.segment is not None else self.cell["plain"]).append(value)

    def handle_endtag(self, tag):
        if tag == "td" and self.cell is not None:
            self.row.append(self.cell)
            self.cell = None
            self.segment = None
        elif tag == "tr" and self.row:
            self.rows.append(self.row)
            self.row = None


def result_token(value: str) -> bool:
    return bool(re.search(r"\d", value)) and not re.fullmatch(r"\d{1,2}", value)


def extract(path: Path, sport: str, source: str):
    parser = ResultParser()
    parser.feed(path.read_text(encoding="utf-8", errors="ignore"))
    records = []
    for row in parser.rows:
        event_index = next((i for i, c in enumerate(row) if c["plain"] and c["plain"][0].startswith(("高男組", "高女組"))), None)
        if event_index is None:
            continue
        raw_event = " ".join(row[event_index]["plain"])
        if sport not in raw_event:
            continue
        gender = "男子組" if raw_event.startswith("高男") else "女子組"
        event = re.sub(r"^高[男女]組" + sport, "", raw_event).strip() or sport
        for rank, cell in enumerate(row[event_index + 1:event_index + 9], 1):
            for seg in cell["segments"]:
                if not seg or not seg[0].startswith("臺北市"):
                    continue
                school = seg[0].replace("臺北市", "").replace("(市立)", "")
                values = seg[1:]
                result = ""
                if values and result_token(values[-1]):
                    result = values.pop()
                names = [x for x in values if x not in {"破大會紀錄", "破全國紀錄"} and not re.search(r"\d", x)]
                if not names:
                    continue
                records.append({
                    "name": "／".join(names), "sport": sport, "team": gender,
                    "school": school, "event": event, "rank": rank,
                    "result": result, "source": source,
                })
    return records


def main():
    if len(sys.argv) != 5:
        raise SystemExit("usage: import_113_results.py athletics.html swimming.html badminton.html output.ts")
    inputs = [
        (Path(sys.argv[1]), "田徑", "https://113sport.tp.edu.tw/Module/Score/FinalsReport_List.php?LID=101"),
        (Path(sys.argv[2]), "游泳", "https://113sport.tp.edu.tw/Module/Score/FinalsReport_List.php?LID=102"),
        (Path(sys.argv[3]), "羽球", "https://113sport.tp.edu.tw/Module/Score/FinalsReport_ListGroup.php?LID=202"),
    ]
    records = []
    for path, sport, source in inputs:
        records.extend(extract(path, sport, source))
    unique = []
    seen = set()
    for item in records:
        key = tuple(item.values())
        if key not in seen:
            seen.add(key)
            unique.append(item)
    body = json.dumps(unique, ensure_ascii=False, indent=2)
    Path(sys.argv[4]).write_text(
        "// Generated from 113 National High School Games official final-result pages.\n"
        "// Historical competition records only; not a current roster.\n"
        "export type PublicResult = {name:string;sport:'羽球'|'田徑'|'游泳';team:'男子組'|'女子組';school:string;event:string;rank:number;result:string;source:string}\n"
        f"export const publicResults:PublicResult[] = {body}\n",
        encoding="utf-8",
    )
    schools = sorted({x["school"] for x in unique})
    print(json.dumps({"records": len(unique), "schools": len(schools), "bySport": {s: sum(x["sport"] == s for x in unique) for s in ("羽球", "田徑", "游泳")}}, ensure_ascii=False))


if __name__ == "__main__":
    main()
