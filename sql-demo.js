/**
 * ======================================================================
 * 【SQL (SOQL) 疑似データベース＆クエリ操作エンジン】
 * ファイル名: sql-demo.js
 * 
 * ■ 概要:
 * RDBMS（リレーショナルデータベース）や Salesforce の SOQL を模して、
 * JavaScriptのオブジェクト配列（メモリ上テーブル）に対して
 * SELECT / WHERE / ORDER BY / INSERT をシミュレートするコードです。
 * 
 * ■ あなたの学習・リハビリ・面接アピール用のポイント:
 * 1. 【データモデリングの理解】:
 *    レコード単位で主キー（Id）や各カラムのデータ型を意識した構造。
 * 2. 【SQLとJS関数の対応関係】:
 *    ・WHERE句  == Array.prototype.filter()
 *    ・SELECT句 == Array.prototype.map()
 *    ・ORDER BY == Array.prototype.sort()
 *    ・COUNT/SUM == Array.prototype.reduce()
 * 3. 【拡張性】:
 *    `DUMMY_ACCOUNT_TABLE` 配列に新しい行を足したり、
 *    新しいクエリ関数をコピペして追加するだけで、自由にSQLデモを拡張できます。
 * ======================================================================
 */

/**
 * 【疑似データベース・テーブル: Account（取引先）】
 * Salesforce CRM や RDBMS の "Account" テーブルに相当するダミーデータです。
 * 
 * ※ 新しいレコードを追加したい場合は、以下の配列の末尾に
 *   オブジェクトをコピー＆ペーストして追加してください！
 */
const DUMMY_ACCOUNT_TABLE = [
  {
    id: "ACC-001",
    name: "トヨタシステムズ様",
    industry: "自動車・製造",
    type: "Enterprise",
    annualRevenue: 120000000,
    isActive: true
  },
  {
    id: "ACC-002",
    name: "サイバーテック株式会社様",
    industry: "IT・通信",
    type: "Enterprise",
    annualRevenue: 65000000,
    isActive: true
  },
  {
    id: "ACC-003",
    name: "スタートアップNEXT様",
    industry: "IT・通信",
    type: "Startup",
    annualRevenue: 18000000,
    isActive: false
  },
  {
    id: "ACC-004",
    name: "みどり金融ホールディングス様",
    industry: "金融・保険",
    type: "Enterprise",
    annualRevenue: 240000000,
    isActive: true
  },
  {
    id: "ACC-005",
    name: "フューチャーデザインスタジオ様",
    industry: "クリエイティブ",
    type: "SMB",
    annualRevenue: 32000000,
    isActive: true
  },
  {
    id: "ACC-006",
    name: "グローバルロジスティクス様",
    industry: "運輸・物流",
    type: "Enterprise",
    annualRevenue: 89000000,
    isActive: false
  }
];

/**
 * 【SQL / SOQL クエリエミュレーター・オブジェクト】
 * SQLの構文をJavaScriptの高階関数で再現したロジック集です。
 */
const SQLEngine = {
  /**
   * 1. 全件取得クエリ
   * SQL: SELECT * FROM Account
   */
  selectAll() {
    return [...DUMMY_ACCOUNT_TABLE];
  },

  /**
   * 2. 大企業（Enterprise）のみ抽出クエリ
   * SQL: SELECT * FROM Account WHERE Type = 'Enterprise'
   */
  selectEnterpriseOnly() {
    // Array.prototype.filter は SQL の WHERE 句に相当します
    return DUMMY_ACCOUNT_TABLE.filter(record => record.type === "Enterprise");
  },

  /**
   * 3. 年商5,000万円以上の高額顧客抽出クエリ
   * SQL: SELECT * FROM Account WHERE AnnualRevenue >= 50000000
   */
  selectHighRevenue() {
    return DUMMY_ACCOUNT_TABLE.filter(record => record.annualRevenue >= 50000000);
  },

  /**
   * 4. 稼働中顧客を年商降順（大きい順）でソートして抽出
   * SQL: SELECT * FROM Account WHERE IsActive = true ORDER BY AnnualRevenue DESC
   */
  selectActiveOrderByRevenueDesc() {
    return DUMMY_ACCOUNT_TABLE
      .filter(record => record.isActive === true)
      // Array.prototype.sort は SQL の ORDER BY 句に相当します
      .sort((a, b) => b.annualRevenue - a.annualRevenue);
  },

  /**
   * 5. 新規レコードの挿入 (INSERT INTO)
   * SQL: INSERT INTO Account (id, name, industry, type, annualRevenue, isActive) VALUES (...)
   */
  insertAccount(newRecord) {
    DUMMY_ACCOUNT_TABLE.push(newRecord);
    return newRecord;
  }

  // ====================================================================
  // 【自由に追加できるエリア】
  // 例:
  // selectByIndustry(targetIndustry) {
  //   return DUMMY_ACCOUNT_TABLE.filter(r => r.industry === targetIndustry);
  // }
  // ====================================================================
};

/**
 * ======================================================================
 * 【UI連携 & テーブル描画制御】
 * 画面上のドロップダウン、実行ボタン、テーブルへのデータ反映を制御します。
 * ======================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
  const querySelect = document.getElementById("sql-query-select");
  const btnRunQuery = document.getElementById("btn-sql-run");
  const btnAddRecord = document.getElementById("btn-sql-add-record");
  const queryTextDisplay = document.getElementById("sql-query-text");
  const tableBody = document.getElementById("sql-table-body");
  const resultCount = document.getElementById("sql-result-count");

  /**
   * 金額を日本円形式に整形する関数（例: ¥120,000,000）
   */
  function formatCurrency(val) {
    return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(val);
  }

  /**
   * レコード配列を受け取り、HTMLテーブル（tbody）に描画する関数
   * @param {Array} records - 表示対象のレコード配列
   */
  function renderTable(records) {
    if (!tableBody) return;
    tableBody.innerHTML = ""; // テーブル内を一旦クリア

    if (records.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">条件に一致するレコードは見つかりませんでした（0件）</td></tr>`;
      if (resultCount) resultCount.textContent = "取得件数: 0 件";
      return;
    }

    records.forEach(record => {
      const row = document.createElement("tr");

      // 有効/無効のバッジ
      const activeBadge = record.isActive
        ? `<span style="color: var(--color-success); font-weight: 600;">● 有効 (True)</span>`
        : `<span style="color: var(--text-muted);">○ 無効 (False)</span>`;

      row.innerHTML = `
        <td style="font-family: var(--font-mono); color: var(--secondary);">${record.id}</td>
        <td><strong>${record.name}</strong></td>
        <td>${record.industry}</td>
        <td><span class="tag">${record.type}</span></td>
        <td style="font-family: var(--font-mono);">${formatCurrency(record.annualRevenue)}</td>
        <td>${activeBadge}</td>
      `;

      tableBody.appendChild(row);
    });

    if (resultCount) {
      resultCount.textContent = `取得件数: ${records.length} 件 （全テーブル保持件数: ${DUMMY_ACCOUNT_TABLE.length} 件）`;
    }
  }

  /**
   * 選択されているクエリ種別に応じて、SQLエンジンを実行する関数
   */
  function executeSelectedQuery() {
    const selectedMode = querySelect ? querySelect.value : "ALL";
    let results = [];
    let sqlString = "";

    switch (selectedMode) {
      case "ALL":
        sqlString = "-- 全件取得\nSELECT Id, Name, Industry, Type, AnnualRevenue, IsActive FROM Account;";
        results = SQLEngine.selectAll();
        break;

      case "ENTERPRISE":
        sqlString = "-- エンタープライズ企業のみ抽出\nSELECT * FROM Account\nWHERE Type = 'Enterprise';";
        results = SQLEngine.selectEnterpriseOnly();
        break;

      case "HIGH_REVENUE":
        sqlString = "-- 年商5000万円以上を抽出\nSELECT * FROM Account\nWHERE AnnualRevenue >= 50000000;";
        results = SQLEngine.selectHighRevenue();
        break;

      case "ACTIVE_SORT":
        sqlString = "-- 稼働中かつ年商降順でソート\nSELECT * FROM Account\nWHERE IsActive = true\nORDER BY AnnualRevenue DESC;";
        results = SQLEngine.selectActiveOrderByRevenueDesc();
        break;

      default:
        results = SQLEngine.selectAll();
    }

    // クエリ表示枠の更新
    if (queryTextDisplay) {
      queryTextDisplay.textContent = sqlString;
    }

    // テーブルの描画
    renderTable(results);
  }

  // --------------------------------------------------------------------
  // クエリ実行ボタン クリックイベント
  // --------------------------------------------------------------------
  if (btnRunQuery) {
    btnRunQuery.addEventListener("click", () => {
      executeSelectedQuery();
    });
  }

  // セレクトボックスの選択肢が変わった時にも即座にクエリ実行
  if (querySelect) {
    querySelect.addEventListener("change", () => {
      executeSelectedQuery();
    });
  }

  // --------------------------------------------------------------------
  // 新規レコード挿入 (INSERT) ボタン
  // --------------------------------------------------------------------
  if (btnAddRecord) {
    btnAddRecord.addEventListener("click", () => {
      const nextNum = DUMMY_ACCOUNT_TABLE.length + 1;
      const newAcc = {
        id: "ACC-" + nextNum.toString().padStart(3, "0"),
        name: `新規追加企業 ${nextNum}号様`,
        industry: "先端テクノロジー",
        type: nextNum % 2 === 0 ? "Enterprise" : "Startup",
        annualRevenue: Math.floor(Math.random() * 80 + 20) * 1000000, // 2,000万〜1億円
        isActive: true
      };

      SQLEngine.insertAccount(newAcc);
      alert(`✅ [INSERT INTO] レコードを追加しました:\n${newAcc.id} : ${newAcc.name} (${formatCurrency(newAcc.annualRevenue)})`);

      // 現在選択されているクエリで再取得・再描画
      executeSelectedQuery();
    });
  }

  // ページ初期表示時に一度全件を取得・描画
  executeSelectedQuery();
});

