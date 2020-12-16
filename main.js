'use strict';

{
  class Quiz {
    constructor() {
      this.quizzes = [];  // クイズ情報
      this.result = 0;  // 回答の正解数
    }

    // クイズAPIの呼び出し
    startQuiz() {
      // クイズ情報を取得
      fetch('https://opentdb.com/api.php?amount=10&type=multiple')
        .then((response) => {
          if (!response.ok) {
            throw new Error();
          }
          return response.json();
        })
        .then((json) => {
          this.quizzes.push(...json.results);
          this.showQuiz(this.quizzes[0], 0);
        })
        .catch((error) => console.log(error));

      // 取得中画面を表示
      const h1 = document.createElement('h1');
      h1.textContent = '取得中';

      const p = document.createElement('p');
      p.textContent = '少々お待ちください';
      p.classList.add('text-border');

      document.body.innerHTML = '';
      document.body.appendChild(h1);
      document.body.appendChild(p);
    }

    // クイズ表示
    showQuiz(quiz, index) {
      document.body.innerHTML = '';
      const h1 = document.createElement('h1');
      h1.textContent = `問題${index + 1}`;
      document.body.appendChild(h1);

      const genre = document.createElement('div');
      genre.textContent = `[ジャンル] ${quiz.category}`;
      genre.classList.add('bold');
      document.body.appendChild(genre);

      const difficulty = document.createElement('div');
      difficulty.textContent = `[難易度] ${quiz.difficulty}`;
      difficulty.classList.add('bold');
      document.body.appendChild(difficulty);

      const question = document.createElement('p');
      question.textContent = this.unEscapeHtml(quiz.question);
      question.classList.add('text-border');
      document.body.appendChild(question);

      const choice = this.shuffleChoices([quiz.correct_answer, ...quiz.incorrect_answers]);
      for (let i = 0; i < choice.length; i++) {
        const answer = document.createElement('button');
        answer.textContent = this.unEscapeHtml(choice[i]);
        answer.classList.add('button-block');
        answer.addEventListener('click', () => this.judgeAnswerAndNextQuizOrResult(answer.textContent, quiz, index));
        document.body.appendChild(answer);
      }
    }

    // 回答の選択肢をランダムに並び替え
    shuffleChoices([...array]) {
      for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // エスケープ文字の変換
    unEscapeHtml(str) {
      return str
        .replace(/(&lt;)/g, '<')
        .replace(/(&gt;)/g, '>')
        .replace(/(&quot;)/g, '"')
        .replace(/(&#039;)/g, "'")
        .replace(/(&amp;)/g, '&')
        .replace(/(&eacute;)/g, 'é');
    }

    // 回答の判定と次のクイズの呼び出しもしくは回答結果の表示
    judgeAnswerAndNextQuizOrResult(answer, quiz, index) {
      // 正解だったら正解数を加算
      if (answer === this.unEscapeHtml(quiz.correct_answer)) {
        this.result++;
      }

      if (index < this.quizzes.length - 1) {
        // 次のクイズの呼び出し
        this.showQuiz(this.quizzes[index + 1], index + 1);
      } else {
        this.showResult();
      }
    }

    // 回答結果の表示
    showResult() {
      document.body.innerHTML = '';
      const h1 = document.createElement('h1');
      h1.textContent = `あなたの正解数は${this.result}です！！`;
      document.body.appendChild(h1);

      const p = document.createElement('p');
      p.textContent = '再度チャレンジしたい場合は以下をクリック！！';
      p.classList.add('text-border');
      document.body.appendChild(p);

      const button = document.createElement('button');
      button.textContent = 'ホームに戻る';
      button.addEventListener('click', () => window.location.reload());
      document.body.appendChild(button);
    }
  }

  const quizData = new Quiz();

  document.getElementById('start-quiz').addEventListener('click', () => quizData.startQuiz());
}
