import St from "gi://St"
import Adw from "gi://Adw"
import Clutter from "gi://Clutter"

export type WidgetProps<A extends Clutter.LayoutManager = Cluttter.LayoutManager, B extends Clutter.BinLayout = Clutter.Content> = Partial<St.Widget.ConstructorProps<A, B>>;
export type BoxLayoutProps = Partial<St.BoxLayout.ConstructorProps>;
export type PreferencesDialogProps = Partial<Adw.PreferencesDialog.ConstructorProps>;
export type PreferencesPageProps = Partial<Adw.PreferencesPage.ConstructorProps>;
export type PreferencesGroupProps = Partial<Adw.PreferencesGroup.ConstructorProps>;
export type ActionRowProps = Partial<Adw.ActionRow.ConstructorProps>;
export type ComboRowProps = Partial<Adw.ComboRow.ConstructorProps>;
export type SpinRowProps = Partial<Adw.SpinRow.ConstructorProps>;
export type EntryRowProps = Partial<Adw.EntryRow.ConstructorProps>;
export type ExpanderRowProps = Partial<Adw.ExpanderRow.ConstructorProps>;