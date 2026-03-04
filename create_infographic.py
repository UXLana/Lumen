#!/usr/bin/env python3
"""
Signal Protocol — The Unspoken Rules of Ending a Work Conversation
LinkedIn Infographic (1080x1920) — Final Polish v3
"""

from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1080, 1920
FONT_DIR = os.path.expanduser("~/.claude/skills/anthropics-canvas-design/canvas-fonts")
OUTPUT = os.path.expanduser("~/Desktop/Code/unspoken-rules-infographic.png")

# === PALETTE ===
BG = (22, 24, 30)
WHITE = (255, 255, 255)
WHITE_90 = (232, 235, 242)
WHITE_DIM = (165, 172, 188)
WHITE_FAINT = (95, 102, 120)
TEAL = (82, 198, 194)
CORAL = (232, 118, 98)
AMBER = (242, 188, 82)
SOFT_BLUE = (115, 152, 222)
PINK = (222, 128, 162)
CARD_BG = (30, 33, 42)
CARD_BORDER = (44, 48, 60)
DIVIDER = (44, 48, 58)
GOLD = (212, 175, 102)
GOLD_BG = (34, 32, 26)
GOLD_BORDER = (70, 62, 38)

# === FONTS ===
def lf(name, size):
    try: return ImageFont.truetype(os.path.join(FONT_DIR, name), size)
    except: return ImageFont.load_default()

f_title = lf("Outfit-Bold.ttf", 54)
f_sub = lf("InstrumentSans-Regular.ttf", 20)
f_num = lf("GeistMono-Bold.ttf", 14)
f_sec = lf("Outfit-Bold.ttf", 28)
f_label = lf("Outfit-Bold.ttf", 22)
f_body = lf("InstrumentSans-Regular.ttf", 20)
f_bold = lf("InstrumentSans-Bold.ttf", 20)
f_desc = lf("InstrumentSans-Regular.ttf", 18)
f_warn = lf("GeistMono-Regular.ttf", 13)
f_golden_t = lf("Outfit-Bold.ttf", 26)
f_golden = lf("InstrumentSerif-Italic.ttf", 22)
f_plat_n = lf("Outfit-Bold.ttf", 21)
f_plat_d = lf("InstrumentSans-Regular.ttf", 16)
f_foot = lf("GeistMono-Regular.ttf", 13)
f_sym = lf("Outfit-Bold.ttf", 13)
f_arrow_text = lf("InstrumentSans-Bold.ttf", 19)

img = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)
M = 72
CW = W - M * 2

def rr(x1, y1, x2, y2, r, fill, outline=None):
    draw.rounded_rectangle([x1, y1, x2, y2], radius=r, fill=fill, outline=outline)

def dt(x, y, r, c):
    draw.ellipse([x-r, y-r, x+r, y+r], fill=c)

def tw(t, f):
    b = f.getbbox(t); return b[2] - b[0]

def wrap(t, f, mw):
    words, lines, cur = t.split(), [], ""
    for w in words:
        test = f"{cur} {w}".strip()
        if tw(test, f) <= mw: cur = test
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines

y = 64

# === HEADER ===
draw.rectangle([M, y, M + 50, y + 4], fill=TEAL)
y += 28

draw.text((M, y), "The Unspoken Rules", fill=WHITE, font=f_title)
y += 62
draw.text((M, y), "of Ending a Work", fill=WHITE, font=f_title)
y += 62
draw.text((M, y), "Conversation", fill=TEAL, font=f_title)
y += 76

draw.text((M, y), "What everyone thinks but nobody says out loud.", fill=WHITE_FAINT, font=f_sub)
y += 26
draw.text((M, y), "Slack  /  Teams  /  LinkedIn  /  The anxiety is universal.", fill=WHITE_FAINT, font=f_sub)
y += 46

draw.rectangle([M, y, W - M, y + 1], fill=DIVIDER)
y += 30

# === SECTION 1 ===
draw.text((M, y), "01", fill=TEAL, font=f_num)
y += 20
draw.text((M, y), "When to React, Reply, or Let It Go", fill=WHITE, font=f_sec)
y += 44

for label, accent, desc in [
    ("React", TEAL, "The other person sent a final thought. No response needed. Just acknowledge."),
    ("Reply", CORAL, "There's a clear question, or the thread needs proper closure."),
    ("Let it go", WHITE_FAINT, "It's a \"sounds good\" or \"thanks!\" You don't need to volley back."),
]:
    ch = 76
    rr(M, y, W - M, y + ch, 12, CARD_BG, outline=CARD_BORDER)
    dt(M + 24, y + 24, 6, accent)
    draw.text((M + 44, y + 12), label, fill=accent, font=f_label)
    for i, ln in enumerate(wrap(desc, f_desc, CW - 58)):
        draw.text((M + 44, y + 40 + i * 21), ln, fill=WHITE_DIM, font=f_desc)
    y += ch + 10

y += 18
draw.rectangle([M, y, W - M, y + 1], fill=DIVIDER)
y += 26

# === SECTION 2 ===
draw.text((M, y), "02", fill=TEAL, font=f_num)
y += 20
draw.text((M, y), "What Each Emoji Signals at Work", fill=WHITE, font=f_sec)
y += 44

for sym_char, meaning, warning, accent in [
    ("+", "Acknowledged / Got it", "can feel cold", AMBER),
    ("~", "Warm close, I appreciate you", "", TEAL),
    ("*", "Celebrating, nothing else to add", "", SOFT_BLUE),
    ("v", "We're close / Great work", "use carefully", PINK),
    ("!", "That was impressive", "Slack/Teams only", CORAL),
]:
    rh = 44
    # accent bar
    draw.rectangle([M, y + 6, M + 3, y + rh - 6], fill=accent)
    # colored dot with symbol
    cx, cy = M + 26, y + rh // 2
    dt(cx, cy, 13, accent)
    sw = tw(sym_char, f_sym)
    draw.text((cx - sw // 2, cy - 8), sym_char, fill=WHITE, font=f_sym)
    # meaning
    mx = M + 54
    draw.text((mx, y + 10), meaning, fill=WHITE_DIM, font=f_desc)
    # warning pill
    if warning:
        wx = mx + tw(meaning, f_desc) + 12
        pw = tw(warning, f_warn) + 16
        rr(wx, y + 12, wx + pw, y + 30, 9, (38, 42, 52))
        draw.text((wx + 8, y + 14), warning, fill=WHITE_FAINT, font=f_warn)
    y += rh

y += 22
draw.rectangle([M, y, W - M, y + 1], fill=DIVIDER)
y += 26

# === SECTION 3 ===
draw.text((M, y), "03", fill=TEAL, font=f_num)
y += 20
draw.text((M, y), "The Last Message Dilemma", fill=WHITE, font=f_sec)
y += 44

for situation, action, accent in [
    ("They said something kind", "React with a smile", TEAL),
    ("They answered your question", "Thumbs up or short \"Thanks!\"", AMBER),
    ("It's clearly done", "Silence is perfectly fine", WHITE_FAINT),
]:
    ch = 66
    rr(M, y, W - M, y + ch, 12, CARD_BG, outline=CARD_BORDER)
    draw.text((M + 22, y + 12), situation, fill=WHITE_90, font=f_body)
    # Arrow as text
    draw.text((M + 22, y + 38), "-->  ", fill=accent, font=f_arrow_text)
    draw.text((M + 64, y + 38), action, fill=accent, font=f_bold)
    y += ch + 10

y += 18
draw.rectangle([M, y, W - M, y + 1], fill=DIVIDER)
y += 26

# === SECTION 4 ===
draw.text((M, y), "04", fill=TEAL, font=f_num)
y += 20
draw.text((M, y), "Platform Vibes", fill=WHITE, font=f_sec)
y += 44

gap = 14
cw = (CW - gap * 2) // 3
ch = 124

for i, (name, desc, accent) in enumerate([
    ("Slack", "Casual, emoji-heavy.\nReactions are\nthe norm.", TEAL),
    ("Teams", "More buttoned-up.\nReactions feel safer\nthan short replies.", SOFT_BLUE),
    ("LinkedIn", "Permanent and public.\nKeep it polished.", CORAL),
]):
    cx = M + i * (cw + gap)
    rr(cx, y, cx + cw, y + ch, 12, CARD_BG, outline=CARD_BORDER)
    draw.rectangle([cx + 16, y + 16, cx + 48, y + 19], fill=accent)
    draw.text((cx + 16, y + 28), name, fill=WHITE, font=f_plat_n)
    for j, ln in enumerate(desc.split("\n")):
        draw.text((cx + 16, y + 56 + j * 20), ln, fill=WHITE_DIM, font=f_plat_d)

y += ch + 30
draw.rectangle([M, y, W - M, y + 1], fill=DIVIDER)
y += 32

# === SECTION 5: GOLDEN RULE ===
draw.text((M, y), "05", fill=GOLD, font=f_num)
y += 20

gh = 98
rr(M, y, W - M, y + gh, 14, GOLD_BG, outline=GOLD_BORDER)
draw.rectangle([M + 1, y + 18, M + 5, y + gh - 18], fill=GOLD)
draw.text((M + 24, y + 16), "The Golden Rule", fill=GOLD, font=f_golden_t)
draw.text((M + 24, y + 54), "When in doubt, a simple smile react is always safe.", fill=WHITE_DIM, font=f_golden)

y += gh + 44

# === FOOTER ===
draw.rectangle([M, y, M + 34, y + 2], fill=TEAL)
y += 14
draw.text((M, y), "svetlana holston", fill=WHITE_FAINT, font=f_foot)

# === SAVE ===
img.save(OUTPUT, "PNG", quality=100)
print(f"Saved: {OUTPUT} ({W}x{H})")
