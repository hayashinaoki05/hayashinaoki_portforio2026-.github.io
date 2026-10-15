/**
 * ======================================================================
 * 【連動型 IT技術力診断クイズ】
 * ファイル名: quiz.js
 * 
 * ■ 概要:
 * Java (OOP) や SQL (SOQL)、JavaScript の実務基礎を題材にした
 * インタラクティブなクイズ機能です。
 * 
 * ■ あなたの学習・リハビリ・面接アピール用のポイント:
 * 1. 【データ駆動型UI】:
 *    問題データはすべて `QUIZ_DATA` 配列で一元管理されています。
 * 2. 【実務再現コードの提示】:
 *    正解時に単なるマルバツだけでなく、「現場で書く実務コードと理由」が表示され、
 *    面接官やレビュアーに「理論と実務の結びつき」を強力にアピールできます。
 * 3. 【拡張性（超簡単）】:
 *    配列の末尾にオブジェクトを1つ追加するだけで、問題数を4問、5問と
 *    何問でも自由に増やすことができます！
 * ======================================================================
 */

/**
 * 【クイズ出題データリスト】
 * ※ 新しい問題を追加したい場合は、以下のフォーマットで配列末尾にコピペしてください。
 * 
 * {
 *   category: "カテゴリ名",
 *   question: "問題文",
 *   options: ["選択肢0", "選択肢1", "選択肢2", "選択肢3"],
 *   correctIndex: 正解の番号 (0〜3),
 *   explanation: "日本語での解説文",
 *   sampleCode: "実務で書く再現コード（複数行文字列）"
 * }
 */
const QUIZ_DATA = [
  // --------------------------------------------------------------------
  // 第1問: Java (Apex) のオブジェクト指向・カプセル化
  // --------------------------------------------------------------------
  {
    category: "☕ Java / Apex (OOP)",
    question: "Javaにおいて、クラスのフィールド（メンバ変数）を private にし、Getter / Setter を経由してアクセスさせる「カプセル化」の最大のメリットは何でしょうか？",
    options: [
      "メモリ使用量を半分に節約できるため",
      "外部からの不正な値の直接代入を防ぎ、バリデーション等の整合性を保つため",
      "コンパイル速度を飛躍的に向上させるため",
      "すべての変数を自動的にデータベースに保存できるようにするため"
    ],
    correctIndex: 1, // 2番目の選択肢が正解
    explanation: "【正解！】カプセル化により、外部クラスから変数を直接改変されるのを防ぎます。Setter内で「金額は1円以上」などのチェック（バリデーション）を挟むことで、不正なデータ状態を防止できます。",
    sampleCode: `// 実務でのJava/Apex実装例（カプセル化）
public class AccountService {
    // 外部から直接アクセスさせない
    private Long revenue;

    // Setterでバリデーションを徹底
    public void setRevenue(Long value) {
        if (value == null || value < 0) {
            throw new IllegalArgumentException("売上金額は0以上である必要があります");
        }
        this.revenue = value;
    }

    public Long getRevenue() {
        return this.revenue;
    }
}`
  },

  // --------------------------------------------------------------------
  // 第2問: SQL (SOQL) のクエリとデータ抽出
  // --------------------------------------------------------------------
  {
    category: "🗄️ SQL / SOQL",
    question: "データベースで「取引先テーブルから、年商が5,000万円以上で稼働中の企業を、年商が大きい順に並べて取得する」場合の正しいSQL句の組み合わせはどれでしょうか？",
    options: [
      "GROUP BY 年商 HAVING 稼働中 ORDER BY 年商 ASC",
      "WHERE 年商 >= 50000000 AND 稼働中 = true ORDER BY 年商 DESC",
      "WHERE 年商 >= 50000000 OR 稼働中 = true ORDER BY 年商 ASC",
      "SELECT 年商 FROM 取引先 WHERE ORDER BY 年商 DESC"
    ],
    correctIndex: 1, // 2番目の選択肢が正解
    explanation: "【正解！】複数条件の絞り込みには「WHERE + AND」を使用し、大きい順（降順）に並び替えるには「ORDER BY カラム名 DESC」を指定します。",
    sampleCode: `-- 実務でのSQL (またはSalesforce SOQL) クエリ例
SELECT Id, Name, AnnualRevenue, IsActive
FROM Account
WHERE AnnualRevenue >= 50000000
  AND IsActive = true
ORDER BY AnnualRevenue DESC
LIMIT 100;`
  },

  // --------------------------------------------------------------------
  // 第3問: フロントエンド (JavaScript) と非同期通信
  // --------------------------------------------------------------------
  {
    category: "💻 JavaScript / Front-End",
    question: "フロントエンド（JavaScript）からバックエンドAPI（Java/Salesforce等）へデータを非同期取得する際、モダンJavaScriptで最も推奨される構文はどれでしょうか？",
    options: [
      "同期的な XMLHttpRequest (XHR)",
      "async / await 構文を用いた Fetch API",
      "document.write() によるHTMLの直接再描画",
      "無限ループによるポーリング処理"
    ],
    correctIndex: 1, // 2番目の選択肢が正解
    explanation: "【正解！】モダンJavaScriptでは Promiseベースの `fetch()` と `async / await` を組み合わせることで、UIをフリーズさせずに可読性の高い非同期コードを記述できます。",
    sampleCode: `// モダンフロントエンドでのAPI非同期取得パターン
async function fetchAccountData(accountId) {
    try {
        const response = await fetch(\`/api/accounts/\${accountId}\`);
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        const data = await response.json();
        return data; // 画面描画へ
    } catch (error) {
        console.error("データ取得失敗:", error);
    }
}`
  }

  // ====================================================================
  // 【問題の追加エリア】
  // ここに4問目、5問目を上記と同じ形式で追加できます！
  // ====================================================================
];


/**
 * ======================================================================
 * 【UI連携 & クイズ進行管理】
 * クイズの出題、クリック判定、スコア計算、次の問題遷移を制御します。
 * ======================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
  // 現在のクイズ進行状態（ステート）
  let currentIndex = 0; // 現在の問題番号 (0スタート)
  let score = 0;        // 正解数
  let isAnswered = false; // 現在の問題に回答済みかどうか

  // DOM要素の参照
  const currentNumEl = document.getElementById("quiz-current-num");
  const totalNumEl = document.getElementById("quiz-total-num");
  const progressFill = document.getElementById("quiz-progress-fill");
  const cardEl = document.getElementById("quiz-card");
  const categoryEl = document.getElementById("quiz-category");
  const questionTextEl = document.getElementById("quiz-question-text");
  const optionsContainer = document.getElementById("quiz-options");
  const feedbackEl = document.getElementById("quiz-feedback");
  const feedbackBadge = document.getElementById("feedback-badge");
  const feedbackText = document.getElementById("feedback-text");
  const feedbackCode = document.getElementById("feedback-code");
  const btnNext = document.getElementById("btn-quiz-next");
  const finishedEl = document.getElementById("quiz-finished");
  const finalScoreEl = document.getElementById("quiz-final-score");
  const btnRestart = document.getElementById("btn-quiz-restart");

  /**
   * 現在の問題を画面にレンダリングする関数
   */
  function renderQuestion() {
    isAnswered = false;
    const currentQuiz = QUIZ_DATA[currentIndex];

    // プログレス表示の更新
    if (currentNumEl) currentNumEl.textContent = currentIndex + 1;
    if (totalNumEl) totalNumEl.textContent = QUIZ_DATA.length;
    if (progressFill) {
      const percentage = ((currentIndex + 1) / QUIZ_DATA.length) * 100;
      progressFill.style.width = `${percentage}%`;
    }

    // カテゴリと問題文
    if (categoryEl) categoryEl.textContent = currentQuiz.category;
    if (questionTextEl) questionTextEl.textContent = currentQuiz.question;

    // 選択肢ボタンの生成
    if (optionsContainer) {
      optionsContainer.innerHTML = "";
      currentQuiz.options.forEach((optText, index) => {
        const btn = document.createElement("button");
        btn.className = "quiz-opt-btn";
        btn.innerHTML = `<span><strong>${String.fromCharCode(65 + index)}.</strong></span> <span>${optText}</span>`;

        btn.addEventListener("click", () => handleSelectOption(index));
        optionsContainer.appendChild(btn);
      });
    }

    // 解説エリアを非表示に戻す
    if (feedbackEl) feedbackEl.classList.add("hidden");
  }

  /**
   * ユーザーが選択肢をクリックした時の判定処理
   * @param {number} selectedIndex - 選択された選択肢のインデックス (0〜3)
   */
  function handleSelectOption(selectedIndex) {
    if (isAnswered) return; // 二重クリック防止
    isAnswered = true;

    const currentQuiz = QUIZ_DATA[currentIndex];
    const isCorrect = selectedIndex === currentQuiz.correctIndex;
    const allButtons = optionsContainer.querySelectorAll(".quiz-opt-btn");

    // ボタンの見た目更新（正解・不正解の色付け）
    allButtons.forEach((btn, idx) => {
      btn.disabled = true; // すべて非活性化
      if (idx === currentQuiz.correctIndex) {
        btn.classList.add("correct"); // 正解のボタンを緑色に
      } else if (idx === selectedIndex && !isCorrect) {
        btn.classList.add("wrong"); // 間違えたボタンを赤色に
      }
    });

    if (isCorrect) {
      score++;
      if (feedbackBadge) {
        feedbackBadge.className = "feedback-badge correct";
        feedbackBadge.textContent = "⭕ 正解！ Excellent";
      }
    } else {
      if (feedbackBadge) {
        feedbackBadge.className = "feedback-badge wrong";
        feedbackBadge.textContent = "❌ 不正解... Nice try!";
      }
    }

    // 解説とコードサンプルの反映
    if (feedbackText) feedbackText.textContent = currentQuiz.explanation;
    if (feedbackCode) feedbackCode.textContent = currentQuiz.sampleCode;

    // 解説エリアを表示
    if (feedbackEl) feedbackEl.classList.remove("hidden");
  }

  /**
   * 「次の問題へ」ボタンが押された時の処理
   */
  if (btnNext) {
    btnNext.addEventListener("click", () => {
      currentIndex++;

      if (currentIndex < QUIZ_DATA.length) {
        renderQuestion();
      } else {
        // 全問終了時
        if (cardEl) cardEl.classList.add("hidden");
        if (finishedEl) finishedEl.classList.remove("hidden");
        if (finalScoreEl) {
          finalScoreEl.textContent = `正解数: ${score} / ${QUIZ_DATA.length} 問 (${Math.round((score / QUIZ_DATA.length) * 100)}%)`;
        }
      }
    });
  }

  /**
   * 「もう一度挑戦する」ボタンが押された時のリセット処理
   */
  if (btnRestart) {
    btnRestart.addEventListener("click", () => {
      currentIndex = 0;
      score = 0;
      if (cardEl) cardEl.classList.remove("hidden");
      if (finishedEl) finishedEl.classList.add("hidden");
      renderQuestion();
    });
  }

  // 初回起動: 第1問目をレンダリング
  if (QUIZ_DATA.length > 0) {
    renderQuestion();
  }
});

