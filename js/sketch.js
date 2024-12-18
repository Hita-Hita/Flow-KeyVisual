// シード値設定
const SEED = 4;

// キャンバスの設定
const CANVAS = {
    A4_WIDTH: 210,
    A4_HEIGHT: 297,
    SCALE: 3.5,
    get WIDTH() { return this.A4_WIDTH * this.SCALE; },
    get HEIGHT() { return this.A4_HEIGHT * this.SCALE; }
};

// テキスト情報の定義
const TEXT_INFO = {
    eventTitle: {
        text: "オーディオビジュアルイベント / フロウ vol.4",
        font: "MABOROSHI_NIJIMI",
        size: 0.025,
        x: 0.5,
        y: 0.02,
        spacing: 0.015,
        align: "CENTER"
    },
    dateTime: {
        date: {
            text: "1/9. THU",
            size: 0.06,
            x: 0.8,
            y: 0.6
        },
        time: {
            text: "18:00-21:00",
            size: 0.03,
            x: 0.8,
            y: 0.63
        }
    },
    location: {
        place: {
            text: "at TERRACE GATE",
            size: 0.04,
            x: 0.8,
            y: 0.68
        },
        detail: {
            text: "on Ritsumeikan Univ. OIC",
            size: 0.03,
            x: 0.8,
            y: 0.71
        }
    },
    participation: {
        text: "参 加 無 料 ・ 予 約 不 要 ・ 入 退 室 自 由",
        font: "MABOROSHI_NIJIMI",
        size: 0.02,
        x: 0.03,
        y: 0.95,
        spacing: 0,
        align: "LEFT"
    },
    producer: {
        text: "Produced by HitaHita",
        font: "JOSEFIN_SLAB",
        size: 0.03,
        x: 0.95,
        y: 0.93
    },
    contact: {
        text: "X (@2024_hitahita)",
        font: "JOSEFIN_SLAB",
        size: 0.025,
        x: 0.98,
        y: 0.96
    },
    hashtag: {
        text: "#flow_hitahita",
        size: 0.025,
        x: 0.8,
        y: 0.74
    }
};

// アセット変数
let KARLA, MABOROSHI_NIJIMI, JOSEFIN_SLAB, FLOW_LOGO, HITAHIATA_LOGO, QR_IMG;
let SPONCERS = [];

// アセットのプリロード
function preload() {
    KARLA = loadFont("../asset/font/Karla-SemiBold.ttf");
    MABOROSHI_NIJIMI = loadFont("../asset/font/maboroshi-nijimi.otf");
    JOSEFIN_SLAB = loadFont("../asset/font/JosefinSlab-Medium.ttf")
    FLOW_LOGO = loadImage("../asset/image/Flow.png");
    HITAHIATA_LOGO = loadImage("../asset/image/HitaHita-Logo.png");
    QR_IMG = loadImage("../asset/image/site-qr.png");

    SPONCERS[0] = loadImage("../asset/image/sponsor/Gonengo.png");
}

// セットアップ関数
function setup() {

    createCanvas(CANVAS.WIDTH, CANVAS.HEIGHT);
    background(255, 0, 0);

    randomSeed(SEED);
    noiseSeed(SEED);

    const GRADIENT_COLORS = generateGradientColors();
    const centerX = random(width);
    const centerY = random(height);

    push();
    translate(width / 2, height / 2);
    translate(random(-width * 0.5, width * 0.5), random(-height * 0.5, height * 0.5));
    drawBackground(GRADIENT_COLORS, 1.7);
    push();
    const n = floor(random(1, 4));
    for(let i = 0; i < n; i++) {
        push();
        scale(3 / n);
        drawNoiseCircles(0, 0, min(width, height) * 0.8, 10, 5000, 0.4, 0.6, 255);
        pop();
    }
    pop();
    pop();

    drawTexts();
    drawLogos();
    drawSponsorBand();
    drawNoise(width * height * 0.2);
    drawQR();
}

// QR画像の表示
function drawQR(){
    push();
    imageMode(CENTER)
    image(QR_IMG, width * 0.08, height * 0.89, min(width, height) * 0.1, min(width, height) * 0.1);
    pop();
}

// グラデーションの作成
function createGradient(grad) {
    const gradient = drawingContext.createRadialGradient(0, 0, 0, 0, 0, 0.5);
    grad.forEach(({ stop, color }) => {
        gradient.addColorStop(stop, `rgb(${color.join(',')})`);
    });
    return gradient;
}

// 背景の描画
function drawBackground(grad, scl=1.0) {
    push();
    noStroke();
    fill(255);
    drawingContext.fillStyle = createGradient(grad);
    // translate(width / 2, height / 2);
    scale(width * 1.2 * scl, height * scl);
    rectMode(CENTER);
    rect(0, 0, 1, 1);
    pop();
}

// ノイズの描画
function drawNoise(count) {
    for (let i = 0; i < count; i++) {
        stroke(255, 100);
        strokeWeight(pow(random(), 2) + 0.2);
        point(random(width), random(height));
    }
}

// テキスト幅の計算
function calculateTextWidth(text, spacing) {
    let totalWidth = 0;
    for (let i = 0; i < text.length; i++) {
        totalWidth += textWidth(text.charAt(i)) + spacing;
    }
    return totalWidth - spacing;
}

// 文字間隔を調整したテキストの描画
function drawSpacedText(txt, x, y, spacing, mode = "LEFT") {
    push();
    textAlign(CENTER, CENTER);

    const totalWidth = calculateTextWidth(txt, spacing);
    let startX = x;

    // モード別の開始位置の計算
    switch (mode) {
        case "CENTER":
            startX = x - totalWidth / 2;
            break;
        case "RIGHT":
            startX = x - totalWidth;
            break;
        case "LEFT":
        default:
            startX = x;
            break;
    }

    let currentX = startX;
    for (let i = 0; i < txt.length; i++) {
        text(txt.charAt(i), currentX, y);
        currentX += textWidth(txt.charAt(i)) + spacing;
    }
    pop();
}

function drawSingleNoiseCircle(radius, vertexCount, minNoiseScale, maxNoiseScale){
    beginShape();
    for (let i = 0; i < vertexCount; i ++){
        const grid = vertexCount / 10;
        const th = map((i % grid), 0, grid, 0, PI);
        const h = map(noise(floor(i/grid)), 0, 1, minNoiseScale, maxNoiseScale);
        const noiseScale = map(pow(sin(th), 3)*h, 0, 1, minNoiseScale, maxNoiseScale)
        const newRadius = radius * noiseScale;
        const angle = TAU * i / vertexCount;
        const x = newRadius * cos(angle);
        const y = newRadius * sin(angle);

        vertex(x, y)
    }
    endShape(CLOSE);
}

// 複数のノイズサークルの描画
function drawNoiseCircles(x, y, maxRadius, circleCount, vertexCount, minNoiseScale, maxNoiseScale, strokeColor) {
    push();
    translate(x, y);
    noFill();
    stroke(255, 100);
    strokeWeight(1.5);

    for (let j = 0; j < circleCount; j++) {
        const radius = map(j, 0, circleCount, maxRadius * 0.3, maxRadius);
        drawSingleNoiseCircle(radius, vertexCount, minNoiseScale, maxNoiseScale);
    }
    pop();
}

// ロゴの描画
function drawLogo(logo, x, y, width) {
    const height = width * logo.height / logo.width;
    imageMode(CENTER);
    image(logo, x, y, width, height);
}

// テキストの描画
function drawTexts() {
    // イベントタイトル
    const title = TEXT_INFO.eventTitle;
    fill(255);
    textFont(eval(title.font));
    textSize(width * title.size);
    drawSpacedText(
        title.text,
        width * title.x,
        height * title.y,
        width * title.spacing,
        title.align
    );

    // 日付と時間
    textFont(KARLA);
    textAlign(RIGHT);
    const date = TEXT_INFO.dateTime.date;
    textSize(width * date.size);
    text(date.text, width * date.x, height * date.y);

    const time = TEXT_INFO.dateTime.time;
    textSize(width * time.size);
    text(time.text, width * time.x, height * time.y);

    // 場所
    const place = TEXT_INFO.location.place;
    textSize(width * place.size);
    text(place.text, width * place.x, height * place.y);

    const detail = TEXT_INFO.location.detail;
    textSize(width * detail.size);
    text(detail.text, width * detail.x, height * detail.y);

    const hashtag = TEXT_INFO.hashtag;
    textSize(width * hashtag.size);
    text(hashtag.text, width * hashtag.x, height * hashtag.y);

    // 参加情報
    const participation = TEXT_INFO.participation;
    textFont(eval(participation.font));
    textSize(width * participation.size);
    drawSpacedText(
        participation.text,
        width * participation.x,
        height * participation.y,
        participation.spacing,
        participation.align
    );

    // 制作者情報
    const producer = TEXT_INFO.producer;
    textFont(eval(producer.font));
    textSize(width * producer.size);
    textAlign(RIGHT);
    text(producer.text, width * producer.x, height * producer.y);

    // 制作者情報
    const contact = TEXT_INFO.contact;
    textFont(eval(contact.font));
    textSize(width * contact.size);
    textAlign(RIGHT);
    text(contact.text, width * contact.x, height * contact.y);
}

// ロゴの描画
function drawLogos() {
    // HitaHitaロゴ
    imageMode(CENTER);
    image(HITAHIATA_LOGO, width * 0.97, height * 0.92, width * 0.015, width * 0.015 * HITAHIATA_LOGO.height / HITAHIATA_LOGO.width);

    // Flowロゴ
    drawLogo(FLOW_LOGO, width / 2, height * 0.45, width * 0.75);
}

// スポンサー表示用の帯を描画
function drawSponsorBand() {
    rectMode(CORNER);
    fill(255);
    noStroke();
    rect(0, height * 0.97, width, height * 0.03);

    const h = height * 0.025;
    const w = h * SPONCERS[0].width / SPONCERS[0].height;

    imageMode(CENTER);
    image(SPONCERS[0], width * 0.5, height * 0.985, w, h)
}

// HSBカラーモデルを使用して色を生成する関数
function generateHSBColor(baseHue, baseSaturation, baseBrightness) {
    // 色相は指定された値の周辺でわずかに変動
    const hue = (baseHue + random(-5, 5)) % 360;
    // 彩度を全体的に下げる（白文字を見やすくするため）
    const saturation = constrain(baseSaturation - 10 + random(-3, 3), 0, 100);
    // 明度を全体的に下げる
    const brightness = constrain(baseBrightness - 20 + random(-3, 3), 0, 100);

    // HSBからRGBに変換
    colorMode(HSB, 360, 100, 100);
    const col = color(hue, saturation, brightness);
    colorMode(RGB, 255);

    return [red(col), green(col), blue(col)];
}

// グラデーションの色設定を生成する関数
function generateGradientColors() {
    // const baseHue = random(360);
    const baseHue = 140;

    return [
        { stop: 0.00, color: generateHSBColor(baseHue, 90, 80) },
        { stop: 0.28, color: generateHSBColor(baseHue, 85, 85) },
        { stop: 0.62, color: generateHSBColor(baseHue, 60, 90) },
        { stop: 0.73, color: generateHSBColor(baseHue, 40, 95) },
        { stop: 1.00, color: generateHSBColor(baseHue, 90, 80) }
    ];
}
