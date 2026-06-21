import re

filepath = 'src/app.js'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

if "import { executeDragMoveMaster, executeDragMoveSection, toggleRippleCascade, setupDragDrop } from './dragDrop.js';" not in content:
    content = content.replace("import { checkTeacherCollision", "import { executeDragMoveMaster, executeDragMoveSection, toggleRippleCascade, setupDragDrop } from './dragDrop.js';\n        import { checkTeacherCollision")

funcs_to_remove = [
    r'const executeDragMoveMaster = \(blockId, grade, slotId\) => \{[\s\S]*?\}\s*(?=const executeDragMoveSection =)',
    r'const executeDragMoveSection = \(blockId, sectionId, slotId, dayFilter\) => \{[\s\S]*?\}\s*(?=import \{ exportData)',
    r'const executeDragMoveSection = \(blockId, sectionId, slotId, dayFilter\) => \{[\s\S]*?\}\s*(?=const triggerImport =)',
    r'const executeDragMoveSection = \(blockId, sectionId, slotId, dayFilter\) => \{[\s\S]*?\}\s*(?=const exportData =)',
    r'const executeDragMoveSection = \(blockId, sectionId, slotId, dayFilter\) => \{[\s\S]*?\}\s*(?=\s*window\.exportData =)',
    r'const toggleRippleCascade = \(checked\) => \{[\s\S]*?\}\s*(?=const renderAutopopulatePanel =)'
]

for func in funcs_to_remove:
    content = re.sub(func, '', content)

if "setupDragDrop({ showToast, renderAll });" not in content:
    content = content.replace("window.onload = function () {", "window.onload = function () {\n        setupDragDrop({ showToast, renderAll });")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("DragDrop refactor complete.")
