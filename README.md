# 老爸私房錢
使用Express製作的記帳網路應用程式

## 功能
1. 使用者可以瀏覽所有消費
2. 使用者可以新增消費紀錄
3. 使用者可以修改消費紀錄
4. 使用者可以刪除消費紀錄
5. 使用者可以透過分類欄位瀏覽特定類別的消費紀錄
6. 自動加總所有消費的金額

## 環境與套件
* Node.js
* Express
* handlebars
* Bootstrap 4

## 安裝與執行步驟
1. 使用終端機，clone此專案到local位置


        git clone https://github.com/tim80411/expense-tracker
2. 使用終端機，進入此專案所在的資料夾


        cd expense-tracker

3. 安裝套件


        npm install
4. 安裝mongodb並在mongodb內建立資料庫restaurant-list
5. 新增種子資料


        npm run seed

6. 啟動伺服器


        npm run dev
7. 看到以下字樣代表成功啟動並監聽server以及成功連上資料庫


        Express server is running on https://localhost:3000
        mongodb connected!

在任一瀏覽器輸入localhost:3000即可進入網站
