# Unicode Emoji Corruption - Quick Reference Card

## 🚨 Emergency Fix Commands

**Identify corrupted emojis:**
```bash
grep -n "�" filename.sh
```

**Replace corrupted emoji (example):**
```bash
sed -i 's/�/🔄/g' filename.sh
```

**Verify fix:**
```bash
bash -n filename.sh && echo "✅ Syntax OK"
```

## 🔍 Detection Methods

| Method | Command | Use Case |
|--------|---------|----------|
| Visual | `grep -n "�" file.sh` | Quick visual check |
| Hex | `sed -n 'Np' file.sh \| hexdump -C` | Technical analysis |
| Binary | `grep -P '\xEF\xBF\xBD' file.sh` | Precise detection |

## 🛠️ Common Fix Patterns

| Corrupted | Correct | Context |
|-----------|---------|---------|
| � | 🔄 | Update/Refresh operations |
| � | ⬆️ | Upgrade operations |
| � | 🔍 | Scanning/Analysis |
| � | ⚡ | High-performance ops |
| � | 📦 | Package operations |

## ⚙️ Prevention Setup

**Terminal:**
```bash
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
```

**Git:**
```bash
git config --global core.quotepath false
git config --global core.precomposeunicode true
```

**Editor (VS Code):**
```json
{"files.encoding": "utf8"}
```

## 🔄 Validation Pipeline

**Pre-commit check:**
```bash
#!/bin/bash
if grep -r $'\uFFFD' .; then
    echo "❌ Unicode corruption found!"
    exit 1
fi
echo "✅ Unicode integrity OK"
```

---
**Reference**: See [UNICODE_EMOJI_CORRUPTION_GUIDE.md](./UNICODE_EMOJI_CORRUPTION_GUIDE.md) for complete documentation.