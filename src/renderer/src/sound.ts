/*
* 受付音声は、以下のサイトからダウンロードしたものを使用しています。
* ボイスゲート (https://vidweb.co.jp/voicegate/)
* 言語: 日本語, タイプ: 日本語 女性1, 速度: 1.25, 高低: 0.0
*/

import { Howl } from 'howler';

// 警告音
const warning = new Howl({
    src: ['/audio/warning.mp3'],
    volume: 1,
});

// 推奨PC受付時に非推奨PCの人が来た場合
// 「非推奨機をお持ちの学生さんです。非推奨機ガイダンス会場へ案内してください。」
export const recommendedPcStudent = () => {
    warning.play();

    setTimeout(() => {
        new Howl({
            src: ['/audio/recommendedPcStudent.mp3'],
            volume: 1,
        }).play();
    }, 800);
}

// 非推奨PC受付時に推奨PCの人が来た場合
// 「推奨機を購入された学生さんです。推奨機ガイダンス会場へ案内してください。」
export const nonRecomendPc = () => {
    warning.play();

    setTimeout(() => {
        new Howl({
            src: ['/audio/nonRecomendPc.mp3'],
            volume: 1,
        }).play();
    }, 800);
}

// 告知事項ありの学生
// 「受付できません。案内所へお越しください。」
export const unableReception = () => {
    warning.play();

    setTimeout(() => {
        new Howl({
            src: ['/audio/unableReception.mp3'],
            volume: 1,
        }).play();
    }, 800);
}
