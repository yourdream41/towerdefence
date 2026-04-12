# コードマップ：夢愛ドリム タワーディフェンス
> script.js — 全2457行 の関数・構造一覧

---

## 📦 セクション1：定数・データ定義（1〜219行）

| 変数名 | 行 | 内容 |
|---|---|---|
| `BOARD_W / BOARD_H` | 3-4 | ボードサイズ (1000×620) |
| `PATH_POINTS` | 6-20 | 敵の移動経路（13頂点） |
| `PLACEMENT_SLOTS` | 22-48 | 配置スロット25個（id, x, y, zone） |
| `RARITY_LABEL` | 50-55 | レア度ラベル対応表 |
| `SYNERGY_INFO` | 57-61 | シナジー3種の定義 |
| `pack()` | 63-71 | ウェーブ敵パック生成ヘルパー |
| `ABILITY_LABELS` | 73-89 | 能力ラベル日本語対応表 |
| `characters` | 92-159 | 自キャラ6体定義（rimu/planner/hype/patissier/moderator/clipmaster） |
| `towers` | 162-169 | タワー6種定義 |
| `relics` | 172-186 | レリック13種定義 |
| `enemies` | 189-195 | 通常敵5種 |
| `eliteEnemies` | 198-204 | エリート敵5種 |
| `bosses` | 207-209 | ボス1体（archive_drake） |
| `stages` | 212-219 | ステージ6段階定義（wave構成含む） |

---

## 🧩 セクション2：DOM参照・初期化（221〜354行）

| 変数/関数名 | 行 | 内容 |
|---|---|---|
| `refs` | 221-285 | 全DOM要素の参照オブジェクト |
| `pathMetrics` | 287 | 経路の長さ計算結果 |
| `pathDistances / jamLineYs` | 288-289 | ボス召喚・妨害の距離/Y座標 |
| `characterMap` 等5つのMap | 291-296 | id→定義オブジェクトのMapキャッシュ |
| `slotElements / state` | 298-299 | スロットDOM要素辞書・ゲーム状態 |
| `init()` | 339-354 | **エントリポイント**。全初期化処理を呼ぶ |
| `createInitialState()` | 303-337 | 初期stateオブジェクト生成 |
| `bindStaticEvents()` | 356-375 | ボタン・マウスイベントのバインド |

---

## 🎬 セクション3：ゲーム開始・ステージ準備（377〜509行）

| 関数名 | 行 | 内容 |
|---|---|---|
| `renderRoute()` | 377-383 | SVGパス描画 |
| `renderSlots()` | 385-402 | 配置スロットのDOM生成 |
| `renderStartSelection()` | 404-408 | 開始オーバーレイの選択肢描画 |
| `renderSelectionLane()` | 410-421 | 選択レーン描画（汎用） |
| `handleStartCharacterChoice()` | 423-426 | 開始時キャラ選択ハンドラ |
| `handleStartTowerChoice()` | 428-431 | 開始時タワー選択ハンドラ |
| `updateStartSummary()` | 433-438 | 開始オーバーレイのサマリ更新 |
| `startRun()` | 440-455 | ゲーム開始処理 |
| `prepareStage(stageIndex)` | 457-509 | ステージ遷移・初期化（単位引き継ぎ含む） |

---

## ⚔️ セクション4：戦闘開始・リザーブ・スキル（511〜653行）

| 関数名 | 行 | 内容 |
|---|---|---|
| `beginBattleFromDeploy()` | 511-531 | デプロイ→バトル移行 |
| `resetSkillCharges()` | 533-543 | スキル使用回数リセット（レリックボーナス込み） |
| `renderReserves()` | 545-596 | 配置バー（自キャラ/タワー）の再描画 |
| `createReserveInner()` | 598-604 | リザーブボタン内HTMLを生成 |
| `renderSkills()` | 606-653 | スキルバーの再描画 |

---

## 🎨 セクション5：UI描画・スロット操作（655〜809行）

| 関数名 | 行 | 内容 |
|---|---|---|
| `renderRelics()` | 655-667 | レリックバー描画 |
| `renderSynergyFeed()` | 669-678 | シナジーフィード描画 |
| `refreshSlotStates()` | 680-686 | スロットCSSクラス更新 |
| `selectPlacement()` | 688-710 | 配置選択の切り替え |
| `onSlotClick(slotId)` | 712-754 | スロットクリック→ユニット配置 |
| `onSlotHover(slotId)` | 756-764 | スロットホバー→射程プレビュー |
| `onSlotLeave()` | 766-771 | スロット離脱→射程消去 |
| `createUnitElement(unit)` | 773-790 | ユニットのDOMボタン生成 |
| `renderRange()` | 792-803 | 射程リング描画 |
| `showRangePreview()` | 805-808 | 射程プレビュー設定 |

---

## 🔄 セクション6：ゲームループ・バトル更新（810〜929行）

| 関数名 | 行 | 内容 |
|---|---|---|
| `gameLoop(frameTime)` | 810-822 | **メインループ**（requestAnimationFrame） |
| `updateBattle(dt)` | 824-862 | フェーズ管理（intro/intermission/wave）+ 各更新呼び出し |
| `startWave(waveIndex)` | 864-873 | waveの開始処理 |
| `buildWaveSpawnQueue(wave)` | 875-887 | waveのスポーンキュー構築 |
| `spawnScheduledEnemies()` | 889-894 | 時間に応じた敵スポーン |
| `spawnEnemy(id, family, dist)` | 896-929 | 敵の生成・初期化（通常/エリート/ボス対応） |

---

## 👾 セクション7：敵更新・ボスAI（931〜1032行）

| 関数名 | 行 | 内容 |
|---|---|---|
| `createEnemyElement()` | 931-941 | 敵DOM要素生成 |
| `updateEnemies(dt)` | 943-988 | 敵の移動・スロウ・再生・妨害・進行管理 |
| `updateBoss(enemy)` | 990-1026 | ボスAI（フェーズ変化/召喚/妨害/シールド） |
| `triggerEnemyJamPulse(enemy)` | 1028-1032 | 妨害敵パルス発動 |

---

## 💥 セクション8：ユニット・弾・ダメージ（1034〜1201行）

| 関数名 | 行 | 内容 |
|---|---|---|
| `updateUnits(dt)` | 1034-1052 | 全ユニットの攻撃クールダウン管理 |
| `updateProjectiles(dt)` | 1054-1079 | 弾の移動・着弾判定 |
| `fireFromUnit(unit, target, stats)` | 1081-1113 | 弾の生成・発射 |
| `explodeProjectile()` | 1115-1121 | 着弾爆発・範囲ダメージ |
| `damageEnemy(enemy, dmg, payload)` | 1123-1182 | ダメージ計算（シールド/クリット/スロウ補正/連鎖） |
| `killEnemy(enemy)` | 1184-1194 | 敵撃破処理（分裂含む） |
| `cleanupDeadEnemies()` | 1196-1200 | 死亡敵の配列から除去 |
| `refreshUnitStates()` | 1202-1206 | ユニットのdisabledクラス更新 |

---

## 🏆 セクション9：ステージクリア・報酬（1208〜1369行）

| 関数名 | 行 | 内容 |
|---|---|---|
| `onStageClear()` | 1208-1215 | ステージクリア（最終→endOverlay / 途中→報酬） |
| `openRewardOverlay()` | 1217-1234 | 報酬オーバーレイ表示 |
| `renderRewardOverlay()` | 1236-1241 | 報酬オーバーレイ描画 |
| `renderRewardLane()` | 1243-1265 | 報酬選択レーン描画（relic/character/tower） |
| `updateRewardSummary()` | 1267-1277 | 報酬サマリ更新・確定ボタン制御 |
| `confirmRewardSelections()` | 1279-1296 | 報酬確定→コレクション追加→次ステージ |
| `pickRelicOptions()` | 1298-1308 | 報酬レリック候補抽選 |
| `pickCharacterOptions()` | 1310-1317 | 報酬キャラ候補抽選 |
| `pickTowerOptions()` | 1319-1321 | 報酬タワー候補抽選 |
| `useCharacterSkill(id)` | 1323-1353 | 自キャラスキル発動（6種分岐） |
| `useRelicSkill(id)` | 1355-1369 | レリックスキル発動（全体攻撃） |

---

## 📊 セクション10：HUD・再生制御（1371〜1445行）

| 関数名 | 行 | 内容 |
|---|---|---|
| `updateHud()` | 1371-1399 | 全HUDメトリクス更新 |
| `updatePlaybackControls()` | 1401-1414 | 速度/ポーズボタン状態更新 |
| `cycleGameSpeed()` | 1416-1424 | 速度1→2→3→1サイクル |
| `togglePause()` | 1426-1432 | ポーズ切り替え |
| `getRemainingDeployCount()` | 1434-1445 | 未配置ユニット数計算 |

---

## 🔍 セクション11：セレクションパネル・配置管理（1447〜1710行）

| 関数名 | 行 | 内容 |
|---|---|---|
| `inspectPlacement()` | 1447-1450 | 配置候補をinspectTargetに設定 |
| `inspectUnit()` | 1452-1455 | 配置済みユニットをinspectTargetに設定 |
| `renderSelectionPanel()` | 1457-1484 | セレクションパネル全体描画 |
| `syncSelectionPanelWithCurrentPlacement()` | 1486-1492 | 選択状態に合わせてパネル同期 |
| `resolveInspectTarget()` | 1494-1519 | inspectTargetを解決してdefinition返却 |
| `getDefaultSelectionMessage()` | 1521-1529 | 状態に応じたデフォルトメッセージ |
| `buildSelectionTags()` | 1531-1544 | タグチップ配列生成 |
| `buildSelectionStats()` | 1546-1570 | ステータスチップ配列生成 |
| `renderInfoChips()` | 1572-1583 | チップDOM描画 |
| `pushUnique()` | 1585-1589 | 重複なし配列追加ユーティリティ |
| `calculateDanger()` | 1591-1602 | 危険度計算（0〜1） |
| `getRemainingEnemyCount()` | 1604-1615 | 残敵総数（現在+未スポーン） |
| `openEndOverlay()` | 1617-1638 | エンドオーバーレイ表示（勝利/敗北） |
| `onEnemyGoal()` | 1640-1644 | 敵ゴール到達→ゲームオーバー |
| `restartRun()` | 1646-1671 | リスタート処理 |
| `autoSelectNextPlacement()` | 1673-1710 | 未配置ユニットを自動選択 |

---

## 🎮 セクション12：ボタン・UI部品（1712〜1822行）

| 関数名 | 行 | 内容 |
|---|---|---|
| `updateBattleStartButton()` | 1712-1735 | 開始ボタンの有効/無効・クラス管理 |
| `normalizeBattleStartButtonLabel()` | 1737-1753 | 開始ボタンのラベルテキスト最終上書き ※1 |
| `createSelectorStrip()` | 1755-1779 | 選択用ストリップDOMボタン生成 |
| `createEndTag()` | 1781-1786 | エンドオーバーレイのタグspan生成 |
| `buildCharacterTooltip()` | 1788-1795 | キャラツールチップHTML生成 |
| `buildTowerTooltip()` | 1797-1805 | タワーツールチップHTML生成 |
| `buildSkillTooltip()` | 1807-1813 | スキルツールチップHTML生成 |
| `buildRelicTooltip()` | 1815-1822 | レリックツールチップHTML生成 |
| `bindTooltip()` | 1824-1832 | ツールチップイベントバインド |
| `moveTooltip()` | 1834-1837 | ツールチップ位置追従 |
| `hideTooltip()` | 1839-1841 | ツールチップ非表示 |

> ※1 **コードメモ**：`updateBattleStartButton`と`normalizeBattleStartButtonLabel`は両方`updateHud()`から呼ばれ、後者が前者のラベルを上書きする。deploy+全配置時、前者は"開始"、後者は"戦闘開始"を設定するため実際に表示されるのは"戦闘開始"のみ。二重管理だが動作に支障はない。

---

## ⚡ セクション13：戦闘計算（1843〜1966行）

| 関数名 | 行 | 内容 |
|---|---|---|
| `getCombatStats(unit)` | 1843-1907 | ユニットの実効ステータス計算（レリック/ステージ/オーラ/グローバルバフ全適用） |
| `getRelicProfile()` | 1909-1966 | 所持レリックから総合プロファイル計算（シナジー判定含む） |

**getCombatStats()の入力依存**：
- `getRelicProfile()` → レリックボーナス
- `stages[state.stageIndex].playerBoost` → ステージ補正
- `getAffectingCharacters(unit)` → オーラ補正
- `state.globalBuffs` → スキルバフ

---

## 🎯 セクション14：ターゲティング・妨害・スロウ（1968〜2047行）

| 関数名 | 行 | 内容 |
|---|---|---|
| `getAffectingCharacters(towerUnit)` | 1968-1977 | タワーに影響するキャラ（範囲内・最大2体）取得 |
| `pickTargetForUnit(unit, range)` | 1979-1990 | 最も前進している射程内敵を選択 |
| `getEnemiesInRadius(x,y,r)` | 1992-1996 | 半径内の生存敵リスト取得 |
| `addSlow(enemy, amount, duration)` | 1998-1999 | スロウスタック追加 |
| `cleanupExpiredSlows(enemy)` | 2002-2006 | 期限切れスロウ除去 |
| `getSlowAmount(enemy)` | 2008-2019 | 現在の最大スロウ量取得（グローバルスロウ込み、上限0.75） |
| `applyDisruptionAround()` | 2021-2027 | 円形範囲の妨害適用 |
| `applyDisruptionLine()` | 2029-2035 | ライン妨害適用 |
| `applyUnitDisruption()` | 2037-2047 | 単体ユニット妨害適用（jamShield考慮） |

---

## ✨ セクション15：VFXエフェクト（2049〜2214行）

| 関数名 | 行 | 内容 |
|---|---|---|
| `flashUnit(unit)` | 2049-2053 | 攻撃時ユニットフラッシュ |
| `spawnTrail()` | 2055-2078 | 射撃トレイル線生成（2本） |
| `spawnImpact(x,y,size)` | 2080-2097 | 着弾リング+フレア生成（420ms） |
| `spawnFloatingText()` | 2099-2109 | ダメージ数字フロート表示（940ms） |
| `spawnWarningCircle()` | 2111-2120 | 円形警告インジケータ |
| `spawnWarningLine()` | 2122-2129 | ライン警告インジケータ |
| `updateWarnings()` | 2131-2142 | 警告タイマー管理・解決 |
| `showStageBanner()` | 2144-2149 | ステージバナー表示 |
| `showCutin()` | 2151-2173 | スキル発動カットイン表示（2200ms） |
| `registerChainKill()` | 2175-2190 | チェインキル登録・バナー表示 |
| `spawnSkillFlash()` | 2192-2200 | スキルフラッシュエフェクト（700ms） |
| `spawnCoinBurst()` | 2202-2214 | 報酬画面コインバーストアニメ |

---

## 🔧 セクション16：ユーティリティ関数（2216〜2457行）

| 関数名 | 行 | 内容 |
|---|---|---|
| `updateBoardShake(dt)` | 2216-2226 | ボードシェイク減衰 |
| `shakeBoard(amount)` | 2228-2230 | シェイク強度設定 |
| `fitBoardToFrame()` | 2232-2241 | ボードのスケール・オフセット計算 |
| `applyBoardTransform()` | 2243-2246 | boardInnerにtransform適用 |
| `createIdMap(list)` | 2248-2252 | id→オブジェクト のMap生成 |
| `buildPathMetrics(points)` | 2254-2267 | 経路セグメント長さ事前計算 |
| `getPathPosition(dist)` | 2269-2279 | 距離→座標変換 |
| `getEnemyDefinition(enemy)` | 2281-2285 | family別定義オブジェクト取得 |
| `getSlot(slotId)` | 2287-2289 | slotId→スロット定義取得 |
| `findUnitBySlot(slotId)` | 2291-2293 | スロットのユニット検索 |
| `findPlacedCharacter(id)` | 2295-2297 | キャラが配置済みか検索 |
| `findEnemyById(id)` | 2299-2301 | 敵IDで検索 |
| `getRemainingTowerCount(id)` | 2303-2307 | タワー残り在庫数計算 |
| `canPlaceSelectedOnSlot()` | 2309-2315 | 現在選択中ユニットが配置可能か |
| `canManagePlacements()` | 2317-2319 | 配置操作可能な状態か（deploy/battle） |
| `hasPlacedStarterLoadout()` | 2321-2324 | キャラ+タワーが最低1体ずつ配置済みか |
| `positionElement(el,x,y)` | 2326-2329 | left/topスタイル設定 |
| `distanceBetweenPoints(a,b)` | 2331-2335 | 2点間距離計算 |
| `pickSeveral(pool,count)` | 2337-2345 | ランダム非重複抽選 |
| `pickRandom(array)` | 2347-2349 | 配列からランダム1件 |
| `clamp(v,min,max)` | 2351-2353 | 値の範囲制限 |
| `randomRange(min,max)` | 2355-2357 | 範囲内ランダム浮動小数 |
| `getFxPalette(iconKey)` | 2359-2384 | アイコンキー別エフェクトカラー取得 |
| `iconSvg(key)` | 2386-2457 | アイコンキー別SVG文字列生成（約35種） |

---

## 🔗 主要な依存関係

```
gameLoop
  └── updateBattle(dt)
        ├── startWave → buildWaveSpawnQueue
        ├── spawnScheduledEnemies → spawnEnemy
        ├── updateWarnings
        ├── updateEnemies → updateBoss / triggerEnemyJamPulse / damageEnemy
        ├── updateUnits → getCombatStats / pickTargetForUnit / fireFromUnit
        │     └── fireFromUnit → explodeProjectile → damageEnemy → killEnemy
        ├── updateProjectiles
        ├── cleanupDeadEnemies
        ├── refreshUnitStates
        └── updateHud
              ├── updateBattleStartButton
              ├── normalizeBattleStartButtonLabel
              └── updatePlaybackControls

getCombatStats(unit)
  ├── getRelicProfile()
  ├── stages[stageIndex].playerBoost
  └── getAffectingCharacters → distanceBetweenPoints

damageEnemy(enemy, baseDamage, payload)
  ├── getRelicProfile()
  ├── getSlowAmount(enemy) → cleanupExpiredSlows
  └── killEnemy → registerChainKill / spawnEnemy（分裂）

confirmRewardSelections()
  └── prepareStage(stageIndex+1)
        └── resetSkillCharges → getRelicProfile
```

---

## 📝 state オブジェクト 主要プロパティ

| プロパティ | 型 | 説明 |
|---|---|---|
| `status` | string | "start" / "deploy" / "battle" / "reward" / "victory" / "gameover" |
| `phase` | string | "idle" / "intro" / "wave" / "intermission" |
| `stageIndex` | number | 現在ステージ（0〜5） |
| `units` | array | 配置済みユニット全体 |
| `enemies` | array | 現在フィールドの敵全体 |
| `projectiles` | array | 飛翔中の弾全体 |
| `warnings` | array | 表示中の警告エフェクト |
| `collection` | object | `{characterIds, towerStocks, relicIds}` |
| `skillCharges` | object | キャラid/relicSkillid → 残チャージ数 |
| `globalBuffs` | object | スキルバフの有効期限タイムスタンプ群 |
| `chainState` | object | `{count, lastKillTime}` チェインキル管理 |
| `selectedPlacement` | object/null | `{kind, id}` 現在選択中ユニット |
| `boardLayout` | object | `{scale, offsetX, offsetY, shakeX, shakeY}` |

