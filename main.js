/**
 * ======================================================================
 * 【メイン UI コントローラー】
 * ファイル名: main.js
 * 
 * ■ 概要:
 * サイト全体のUIインタラクションを統括するスクリプトです。
 * 1. ナビゲーションのモバイル開閉（ハンバーガーメニュー）
 * 2. ページ内リンクのスムーズスクロール＆アクティブハイライト
 * 3. 技術展示（Tech Gimmick）のタブ切り替え
 * 4. お問い合わせフォーム送信モック
 * 
 * ■ あなたの学習・リハビリ・編集ポイント:
 * 各機能が独立した関数・イベントリスナーとして書かれています。
 * 「この動作を変えたい」と思ったら該当の見出しブロックを書き換えてください。
 * ======================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
//document：htmlをいじるときに必要なデータ。この後の.の先でhtmlに関して何かしらの指示をする。
//document.addEventlistener:カッコ内に含まれるイベントが発生した場合、さらにそのカッコ内のイベントを発生させてね、という意味。
//() => { :アロー関数と呼ばれ、小括弧に引数を、中括弧にその後の処理を記載するための土台みたいなもの。function(){}と全く同じ意味。
  // ====================================================================
  // 1. 技術展示（Tech Gimmick）タブ切り替え機能
  // ====================================================================
  const tabButtons = document.querySelectorAll(".tab-btn");
  //const:変数の作成、および宣言。
  //document.querySelectorAll:小括弧内に入っているcssのタグ全てを呼び出し、まとめてくれる。全員集合。
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      // 1. すべてのタブボタンから active クラスを外す
      tabButtons.forEach(btn => btn.classList.remove("active"));
      // 2. すべてのコンテンツ（pane）から active クラスを外す
      tabPanes.forEach(pane => pane.classList.remove("active"));

      // 3. クリックされたボタンを active にする
      button.classList.add("active");

      // 4. 対応するコンテンツ（data-tab="tab-xxx"）を表示する
      const targetTabId = button.getAttribute("data-tab");
      const targetPane = document.getElementById(targetTabId);
      if (targetPane) {
        targetPane.classList.add("active");
      }
    });
  });

  // ====================================================================
  // 2. モバイル用ハンバーガーメニューの開閉制御
  // ====================================================================
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });

    // メニュー内のリンクをクリックしたら自動でメニューを閉じる
    const navLinks = navMenu.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
      });
    });
  }

  // ====================================================================
  // 3. スクロールに応じたナビゲーションのアクティブ表示 (Scrollspy)
  // ====================================================================
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(currentSection => {
      const sectionHeight = currentSection.offsetHeight;
      const sectionTop = currentSection.offsetTop - 120; // ヘッダー分オフセット
      const sectionId = currentSection.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightNavOnScroll);

  // ====================================================================
  // 4. お問い合わせフォーム送信のモック（疑似動作）
  // ====================================================================
  const contactForm = document.getElementById("contact-form");
  const contactFeedback = document.getElementById("contact-feedback");

  if (contactForm && contactFeedback) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault(); // 画面リロード（通常のフォームPOST）を防止

      const nameInput = document.getElementById("contact-name");
      const name = nameInput ? nameInput.value : "訪問者";

      // 成功メッセージを表示
      contactFeedback.className = "form-result success";
      contactFeedback.textContent = `送信完了: ${name} 様、メッセージを正常に受け付けました！（動作モックのため実際には送信されません）`;
      contactFeedback.classList.remove("hidden");

      // 入力欄をクリア
      contactForm.reset();

      // 6秒後にフィードバックをフェードアウト
      setTimeout(() => {
        contactFeedback.classList.add("hidden");
      }, 6000);
    });
  }

  // ====================================================================
  // 5. コンソールへのエンジニア向けイースターエッグメッセージ
  // ブラウザの「F12」開発者ツールを開いた面接官へのサプライズ
  // ====================================================================
  console.log(
    "%c👋 Welcome to My Portfolio!",
    "color: #3b82f6; font-size: 20px; font-weight: bold;"
  );
  console.log(
    "%c開発者ツールのコンソールをご覧いただきありがとうございます。\n本サイトは拡張性と保守性を最重要視し、Vanilla JS・CSS変数で設計されています。\nJava・SQLのシミュレーターコードも自由に拡張可能です。",
    "color: #9ca3af; font-size: 13px; line-height: 1.6;"
  );
});

