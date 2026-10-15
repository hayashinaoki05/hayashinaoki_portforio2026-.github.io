/**
 * ======================================================================
 * 【JAVA (Apex) オブジェクト指向 擬似シミュレーター】
 * ファイル名: java-demo.js
 * 
 * ■ 概要:
 * JavaScript(ES6)の class 構文を用いて、Java / Salesforce Apex の
 * 「オブジェクト指向プログラミング (OOP)」の概念を再現したコードです。
 * 
 * ■ あなたの学習・リハビリ・面接アピール用のポイント:
 * 1. 【カプセル化 (Encapsulation)】:
 *    プライベート変数（#フィールド）を使い、外部からの不正な直接書き換えを防ぎます。
 * 2. 【ビジネスロジックの集約】:
 *    データの保持だけでなく、「年商の計算」や「ランクの判定」などの業務ルールを
 *    クラスメソッド内に閉じ込めることで、再利用性と保守性を高めています。
 * 3. 【拡張性】:
 *    後から新しいメソッド（例: applyDiscount, archiveAccount など）を
 *    JavaScriptの書き方のまま、Javaの知識証明として気軽に追加できます！
 * ======================================================================
 */

/**
 * 【ベースクラス（基底クラス）】
 * Javaでいう `abstract class BaseEntity` のイメージです。
 * すべてのエンティティが共通で持つ「ID」や「作成日時」を管理します（継承のデモ）。
 */
class BaseEntity {
  // プライベートフィールド（Javaの private String id; に相当）
  #id;
  #createdAt;

  constructor(id) {
    this.#id = id || "REC-" + Math.floor(1000 + Math.random() * 9000);
    this.#createdAt = new Date();
  }

  // Getterメソッド（Javaの getId() に相当。カプセル化）
  getId() {
    return this.#id;
  }

  getCreatedAt() {
    return this.#createdAt.toLocaleString("ja-JP");
  }
}

/**
 * 【メインクラス: JavaAccountManager】
 * 取引先（企業）とその商談（Deals）を管理するビジネスロジッククラスです。
 * Java / Apex でよくある「取引先管理サービス」を模しています。
 */
class JavaAccountManager extends BaseEntity {
  // ====================================================================
  // 1. フィールド定義（Javaの private フィールドに相当）
  // ====================================================================
  #accountName;     // String accountName: 取引先名
  #industry;        // String industry: 業界種別
  #deals = [];      // List<Deal> deals: 紐づく商談リスト（JavaのList<T>に相当）
  #tier = "BRONZE"; // TierEnum tier: 顧客ランク (BRONZE, SILVER, GOLD, PLATINUM)

  /**
   * コンストラクタ（Javaの public JavaAccountManager(...) に相当）
   * @param {string} accountName - 取引先企業名
   * @param {string} industry - 業種（IT, Finance, Manufacturing など）
   */
  constructor(accountName, industry) {
    super(); // 親クラス（BaseEntity）のコンストラクタを呼び出し
    this.#accountName = accountName;
    this.#industry = industry;
  }

  // ====================================================================
  // 2. ビジネスロジック・メソッド群
  // 後からあなたのアイディアで自由にメソッドを追加してください！
  // ====================================================================

  /**
   * 【商談の追加メソッド】
   * Java: public void addDeal(String dealName, long amount)
   * 
   * @param {string} dealName - 商談名
   * @param {number} amount - 受注金額（円）
   */
  addDeal(dealName, amount) {
    // 入力バリデーション（Javaでの防御的プログラミング）
    if (!dealName || amount <= 0) {
      throw new Error("[ValidationError] 商談名と1円以上の金額を指定してください。");
    }

    const deal = {
      dealId: "OPP-" + (this.#deals.length + 1).toString().padStart(3, "0"),
      name: dealName,
      amount: amount,
      closeDate: new Date().toLocaleDateString("ja-JP")
    };

    // コレクションへの追加（Javaの deals.add(deal); に相当）
    this.#deals.push(deal);
    return deal;
  }

  /**
   * 【合計売上高の計算メソッド】
   * Java: public long calculateTotalRevenue()
   * 商談リストをループし、累計金額を算出します。
   * 
   * @returns {number} 合計売上金額
   */
  calculateTotalRevenue() {
    // JavaのStream API (deals.stream().mapToLong(Deal::getAmount).sum()) に相当
    return this.#deals.reduce((total, deal) => total + deal.amount, 0);
  }

  /**
   * 【顧客ランク（Tier）の自動判定ロジック】
   * Java: public String evaluateTier()
   * 
   * 業務ルール（ビジネスロジック）:
   * - 5,000万円以上: PLATINUM
   * - 2,000万円以上: GOLD
   * - 500万円以上: SILVER
   * - それ未満: BRONZE
   * 
   * @returns {string} 新しいランク
   */
  evaluateTier() {
    const total = this.calculateTotalRevenue();

    if (total >= 50000000) {
      this.#tier = "PLATINUM";
    } else if (total >= 20000000) {
      this.#tier = "GOLD";
    } else if (total >= 5000000) {
      this.#tier = "SILVER";
    } else {
      this.#tier = "BRONZE";
    }

    return this.#tier;
  }

  /**
   * 【概要レポート出力メソッド】
   * Java: public Map<String, Object> getSummary()
   * 画面やコンソールに整形して表示するためのデータを返却します。
   */
  getSummary() {
    return {
      recordId: this.getId(),
      createdAt: this.getCreatedAt(),
      accountName: this.#accountName,
      industry: this.#industry,
      dealCount: this.#deals.length,
      totalRevenue: this.calculateTotalRevenue(),
      currentTier: this.#tier,
      dealList: [...this.#deals] // 配列のシャローコピー（不変性を保護）
    };
  }

  // ====================================================================
  // 【自由に追加できるエリア】
  // 例:
  // applyPromotionCampaign(campaignCode) { ... }
  // ====================================================================
}


/**
 * ======================================================================
 * 【UI連携 & ターミナル描画制御】
 * 画面上の「インスタンス生成」「商談追加」ボタンと上記クラスを繋ぐ制御コードです。
 * ======================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
  // 現在操作中の JavaAccountManager インスタンスを保持する変数
  let activeManager = null;

  // DOM要素の参照取得
  const terminal = document.getElementById("java-terminal");
  const btnInit = document.getElementById("btn-java-init");
  const btnAddDeal = document.getElementById("btn-java-add-deal");
  const btnCalcTier = document.getElementById("btn-java-calc-tier");
  const btnReset = document.getElementById("btn-java-reset");

  /**
   * ターミナルに1行テキストを出力するヘルパー関数
   * @param {string} text - 出力する文字
   * @param {string} type - クラス名（line-command, line-success, line-comment など）
   */
  function logToTerminal(text, type = "") {
    if (!terminal) return;
    const line = document.createElement("div");
    line.className = `terminal-line ${type}`;
    line.textContent = text;
    terminal.appendChild(line);
    // 自動で最下部にスクロール
    terminal.scrollTop = terminal.scrollHeight;
  }

  /**
   * 金額を日本円形式に整形する関数（例: 10,000,000 円）
   */
  function formatYen(amount) {
    return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(amount);
  }

  // --------------------------------------------------------------------
  // ボタン1: インスタンス生成の実行
  // --------------------------------------------------------------------
  if (btnInit) {
    btnInit.addEventListener("click", () => {
      terminal.innerHTML = ""; // ターミナルをクリア
      logToTerminal("// --- Step 1: Java/Apex クラスのインスタンス化 (new) ---", "line-comment");
      logToTerminal("> JavaAccountManager manager = new JavaAccountManager(\"グローバルクラウド株式会社\", \"情報通信業\");", "line-command");

      // 実際にクラスをインスタンス化
      activeManager = new JavaAccountManager("グローバルクラウド株式会社", "情報通信業");
      const summary = activeManager.getSummary();

      logToTerminal(`[System] インスタンス生成完了: ID = ${summary.recordId}`, "line-success");
      logToTerminal(`[Info] 取引先名: ${summary.accountName} / 業種: ${summary.industry}`);
      logToTerminal(`[Info] 初期ランク: ${summary.currentTier} (商談件数: ${summary.dealCount}件)`);
      logToTerminal("// 次に「2. 商談を追加」ボタンを押してください。", "line-comment");

      // ボタンの活性・非活性制御
      btnAddDeal.disabled = false;
      btnCalcTier.disabled = false;
    });
  }

  // --------------------------------------------------------------------
  // ボタン2: 商談の追加
  // --------------------------------------------------------------------
  if (btnAddDeal) {
    btnAddDeal.addEventListener("click", () => {
      if (!activeManager) return;

      logToTerminal("\n// --- Step 2: リストへの要素追加 (addDeal メソッド呼び出し) ---", "line-comment");

      // サンプルの商談データ
      const sampleDeals = [
        { name: "基幹CRMリプレイス案件", amount: 15000000 },
        { name: "フロントエンドUI刷新プロジェクト", amount: 8500000 },
        { name: "年間保守・運用サポート契約", amount: 12000000 }
      ];

      // ランダムに商談を選択
      const randomDeal = sampleDeals[Math.floor(Math.random() * sampleDeals.length)];
      
      logToTerminal(`> manager.addDeal("${randomDeal.name}", ${randomDeal.amount});`, "line-command");
      const newDeal = activeManager.addDeal(randomDeal.name, randomDeal.amount);

      logToTerminal(`[Success] 商談レコード登録: [${newDeal.dealId}] ${newDeal.name}`, "line-success");
      logToTerminal(`[Data] 受注金額: ${formatYen(newDeal.amount)} (計上日: ${newDeal.closeDate})`);
      logToTerminal(`[Total] 現在の累計売上高: ${formatYen(activeManager.calculateTotalRevenue())}`);
    });
  }

  // --------------------------------------------------------------------
  // ボタン3: 顧客ランク判定（ビジネスロジック評価）
  // --------------------------------------------------------------------
  if (btnCalcTier) {
    btnCalcTier.addEventListener("click", () => {
      if (!activeManager) return;

      logToTerminal("\n// --- Step 3: ビジネスロジック実行 (evaluateTier) ---", "line-command");
      logToTerminal("> String newTier = manager.evaluateTier();", "line-command");

      const newTier = activeManager.evaluateTier();
      const total = activeManager.calculateTotalRevenue();

      logToTerminal(`[Logic Evaluation] 累計売上 ${formatYen(total)} に基づくランク評価...`, "line-warning");
      logToTerminal(`⭐ 判定結果ランク: 【 ${newTier} 】`, "line-system");

      const summary = activeManager.getSummary();
      logToTerminal(`[Summary] 登録商談数: ${summary.dealCount}件 / 最終ステータス: 正常`, "line-success");
    });
  }

  // --------------------------------------------------------------------
  // リセットボタン
  // --------------------------------------------------------------------
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      activeManager = null;
      terminal.innerHTML = "";
      logToTerminal("// ターミナルをリセットしました。再度「1. インスタンス生成」を押してください。", "line-comment");
      btnAddDeal.disabled = true;
      btnCalcTier.disabled = true;
    });
  }
});

