import re

filepath = 'src/app.js'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
if "import { checkTeacherCollision, checkDuplicateSubject, assignTeacherQuick, getLiveStatus, setupScheduling } from './scheduling.js';" not in content:
    content = content.replace("import { exportData", "import { checkTeacherCollision, checkDuplicateSubject, assignTeacherQuick, getLiveStatus, setupScheduling } from './scheduling.js';\n        import { exportData")

# 2. Remove functions
funcs_to_remove = [
    r'const checkTeacherCollision = \(block\) => \{[\s\S]*?\}\s*(?=const checkDuplicateSubject =)',
    r'const checkDuplicateSubject = \(block\) => \{[\s\S]*?\}\s*(?=window.addEventListener)',
    r'const assignTeacherQuick = \(teacherId\) => \{[\s\S]*?\}\s*(?=const getActiveTimeSlotsForCurrentView =)',
    r'const getLiveStatus = \(teacherId\) => \{[\s\S]*?\}\s*(?=const updateTimeSlotGroup =)'
]

for func in funcs_to_remove:
    content = re.sub(func, '', content)

# 3. Add setup setupScheduling({ showToast, renderAll, renderResourceLists }) into window.onload
if "setupScheduling({ showToast, renderAll, renderResourceLists });" not in content:
    content = content.replace("window.onload = function () {", "window.onload = function () {\n        setupScheduling({ showToast, renderAll, renderResourceLists });")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Scheduling refactor complete.")
