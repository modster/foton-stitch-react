export interface SettingsRowAction {
  readonly type: 'toggle' | 'link' | 'select';
  readonly value?: boolean | string;
  readonly options?: ReadonlyArray<string>;
}

export interface SettingsRow {
  readonly id: string;
  readonly icon: string;
  readonly iconColor?: 'primary' | 'tertiary';
  readonly label: string;
  readonly description?: string;
  readonly action: SettingsRowAction;
}

export interface SettingsSection {
  readonly id: string;
  readonly title: string;
  readonly rows: ReadonlyArray<SettingsRow>;
}