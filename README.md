# AMS Athletic Intelligence

以「大同高中羽球隊」為示範情境的網頁版 Athletic Management System。目前可操作版本包含隊伍總覽、男／女隊切換、選手狀態、週課表、週期進度、機能重建提示、訓練模組資料庫，以及週五 14:00–17:00 的選單式開課表流程。

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
