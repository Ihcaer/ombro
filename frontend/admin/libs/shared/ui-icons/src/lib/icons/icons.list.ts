// Material symbols
const navigationIconsSet = [
  'home',
  'dashboard',
  'first_page',
  'last_page',
  'chevron_backward',
  'chevron_forward',
  'keyboard_arrow_down',
  'keyboard_arrow_up',
  'left_panel_close',
  'left_panel_open',
] as const;
const actionIconsSet = [
  'search',
  'edit',
  'delete',
  'content_copy',
  'content_cut',
  'content_paste',
  'download',
  'upload_file',
  'send',
  'refresh',
  'cached',
  'mop',
  'filter_alt',
  'more_horiz',
  'close',
] as const;
const userAuthIconsSet = [
  'account_box',
  'account_circle',
  'person_check',
  'person_off',
  'groups',
  'login',
  'logout',
  'exit_to_app',
  'lock_person',
  'lock_reset',
  'lock_open',
  'lock_open_right',
  'user_attributes',
] as const;
const filesContentIconsSet = [
  'folder',
  'folder_eye',
  'create_new_folder',
  'drive_file_move',
  'storage',
  'inventory_2',
  'article',
  'draft',
  'draft_orders',
  'photo_library',
  'history',
] as const;
const statusInfoIconsSet = [
  'info',
  'help',
  'warning',
  'check_circle',
  'verified_user',
  'shield_question',
  'gpp_bad',
  'visibility',
  'preview',
  'label_important',
  'crown',
  'gavel',
  'rule',
] as const;
const systemIconsSet = [
  'settings',
  'link',
  'open_in_browser',
  'open_in_new',
  'event',
  'commit',
] as const;

export const MATERIAL_ICONS = [
  ...navigationIconsSet,
  ...actionIconsSet,
  ...userAuthIconsSet,
  ...filesContentIconsSet,
  ...statusInfoIconsSet,
  ...systemIconsSet,
] as const;
export type MaterialIconName = (typeof MATERIAL_ICONS)[number];

// Svg icons
const fileTypeIconsSet = [
  'file',
  'file-archive',
  'file-audio',
  'file-document',
  'file-image',
  'file-pdf',
  'file-presentation',
  'file-spreadsheet',
  'file-text',
  'file-video',
] as const;

export const CUSTOM_ICONS = [...fileTypeIconsSet] as const;
export type CustomIconName = (typeof CUSTOM_ICONS)[number];

export type IconName = MaterialIconName | CustomIconName;

export const isMaterialIcon = (name: string): name is MaterialIconName =>
  (MATERIAL_ICONS as readonly string[]).includes(name as MaterialIconName);
