# 運動員管理系統

以「臺北市運動科學中心」為角色情境的 Athletic Management System 教學原型。v0.3 以 113 年全中運官方公開成績建立羽球、田徑、游泳各 3 筆臺北市高中成績範例，並保留選手歷程、檢測、處方與教練協作的資料架構。

> 製作單位：臺灣運動健康科技學會
>
> 本系統僅提供 AI 工具教學使用，不開放教練或選手後續私下使用，亦不對外提供開放使用，僅供教學用途。

公開成績範例不代表現役完整名單。未公開的國中／國小經歷、傷病史、體能測驗與技術資料不推測，須經本人、監護人及管理單位依治理程序授權後補登。

## 本機開發

```bash
pnpm install
pnpm dev
pnpm build
```

未連接 Firebase 時，課表草稿儲存於當前瀏覽器的 `localStorage`；它不會自動跨裝置同步，也不應放真實病史。

## Firebase 接軌

已連接 Firebase 專案 `ams-athletic-intelligence`，預期 Hosting 網址為 `https://ams-athletic-intelligence.web.app`。

1. 在 Firebase Console 建立或指定一個專案。
2. 於 Authentication 啟用組織允許的登入方式（建議 Google Workspace）。
3. 建立 Cloud Firestore，不要使用長期開放的測試規則。
4. 複製 `.env.example` 為 `.env.local` 並填入 Web App 設定。
5. 先在 Emulator 驗證 `firestore.rules`，再部署 Hosting 與 Rules。

```bash
firebase use --add
firebase emulators:start
firebase deploy --only hosting,firestore:rules,firestore:indexes
```

## 角色與醫療資料邊界

- `owner/admin`：組織、成員與所有資料的管理。
- `coach`：選手一般資料、訓練模組、課表、週期與成績。
- `medical`：可讀寫分開儲存的醫療／病史資料。
- 醫療資料必須放在 `athletes/{athleteId}/medical`，不可與一般選手卡放在同一份文件；Firestore 觀看權限是文件層級，無法僅隱藏同一文件的部分欄位。

## 建議資料集

`organizations/{orgId}` 下使用 `members`, `teams`, `athletes`, `trainingModules`, `trainingSessions`, `cycles`, `competitions`；醫療資料放在選手文件下的獨立 `medical` 子資料集。

## 交付狀態

這是可操作的產品原型與 Firebase-ready 基礎，不是已完成個資治理、權限驗收、真實選手資料遷移的正式生產系統。正式上線前還需完成帳號擁有者、資料保留期、同意書、備份／還原、Rules Emulator 測試與組織權限驗收。
