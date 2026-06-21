import re

filepath = 'src/app.js'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
if "import { exportData, triggerImport, handleImport, setupImportExport } from './importExport.js';" not in content:
    content = content.replace("import { initCloudSync", "import { exportData, triggerImport, handleImport, setupImportExport } from './importExport.js';\n        import { initCloudSync")

# 2. Remove functions
funcs_to_remove = [
    r'const exportData = \(\) => \{[\s\S]*?\}\s*(?=const triggerImport =)',
    r'const triggerImport = \(\) => \{[\s\S]*?\}\s*(?=const handleImport =)',
    r'const handleImport = \(e\) => \{[\s\S]*?\}\s*(?=const handleCreateClass =)'
]

for func in funcs_to_remove:
    content = re.sub(func, '', content)

# 3. Add setup setupImportExport({ showToast, setActiveTab }) into window.onload
if "setupImportExport({ showToast, setActiveTab });" not in content:
    content = content.replace("window.onload = function () {", "window.onload = function () {\n        setupImportExport({ showToast, setActiveTab });")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("ImportExport refactor complete.")
