import re

filepath = 'src/app.js'
with open(filepath, 'r', encoding='utf-8-sig') as f:
    content = f.read()

# 1. Add import
if "import { State, saveState, loadState } from './state.js';" not in content:
    content = content.replace("import { defaultState } from './defaults.js';", "import { State, saveState, loadState } from './state.js';\n        import { defaultState } from './defaults.js';")

# 2. Remove the declarations
declarations_to_remove = [
    r"let summaryFilter = 'all';",
    r"let summarySearchQuery = '';",
    r"let inlineEditingSlotId = null; // Currently editing slot row identifier",
    r"let workspaceState = JSON.parse\(JSON\.stringify\(defaultState\)\);",
    r"let draggedBlockId = null;",
    r"let activeQuickMoveId = null;",
    r"let activeResourceTab = 'school';",
    r"let activeSelectedCardId = null;",
    r"let activeTeacherFilterId = null;",
    r"let expandedTeacherId = null;",
    r"let activeTimeSlotFilter = 'all';",
    r"let editingTeacherId = null;",
    r"let editingSubjectId = null;",
    r"let editingSectionId = null;",
    r"let editingTimeSlotId = null;"
]

for decl in declarations_to_remove:
    content = re.sub(decl, '', content)

# Remove old saveState and loadState functions (simple replacement since we know their shape)
save_state_func = r"const saveState = \(\) => {\s*writeSavedState\(workspaceState\);\s*if \(isCloudConnected && currentRoomCode\) {\s*saveToCloud\(currentRoomCode, workspaceState\);\s*}\s*};"
load_state_func = r"const loadState = \(\) => {\s*const saved = readSavedState\(\);\s*if \(saved\) {\s*workspaceState = migrateLegacyData\(saved\);\s*} else {\s*workspaceState = migrateLegacyData\(JSON\.parse\(JSON\.stringify\(defaultState\)\)\);\s*}\s*};"

content = re.sub(save_state_func, '', content)
content = re.sub(load_state_func, '', content)

# 3. Replace variable usages
replacements = {
    r'\bworkspaceState\b': 'State.workspace',
    r'\bsummaryFilter\b': 'State.summaryFilter',
    r'\bsummarySearchQuery\b': 'State.summarySearchQuery',
    r'\binlineEditingSlotId\b': 'State.inlineEditingSlotId',
    r'\bdraggedBlockId\b': 'State.draggedBlockId',
    r'\bactiveQuickMoveId\b': 'State.activeQuickMoveId',
    r'\bactiveResourceTab\b': 'State.activeResourceTab',
    r'\bactiveSelectedCardId\b': 'State.activeSelectedCardId',
    r'\bactiveTeacherFilterId\b': 'State.activeTeacherFilterId',
    r'\bexpandedTeacherId\b': 'State.expandedTeacherId',
    r'\bactiveTimeSlotFilter\b': 'State.activeTimeSlotFilter',
    r'\beditingTeacherId\b': 'State.editingTeacherId',
    r'\beditingSubjectId\b': 'State.editingSubjectId',
    r'\beditingSectionId\b': 'State.editingSectionId',
    r'\beditingTimeSlotId\b': 'State.editingTimeSlotId'
}

for old, new_var in replacements.items():
    content = re.sub(old, new_var, content)

# Fix saveState call to pass the cloud args
content = content.replace("saveState();", "saveState(isCloudConnected, currentRoomCode, saveToCloud);")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Refactoring complete.")
