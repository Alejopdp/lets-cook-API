import { Permission } from "../permission/Permission";

export class Role {
  private _title: string;
  private _permissions: Permission[];

  constructor(title: string, permissions: Permission[]) {
    this._title = title;
    this._permissions = permissions;
  }

  public addPermission(newPermission: Permission): void {
    if (this.permissions.some((permission) => permission === newPermission)) {
      throw new Error(`El rol ${this.title} ya tiene el permiso ${newPermission}`);
    } else {
      this.permissions.push(newPermission);
    }
  }

  public removePermission(permissionToRemove: Permission): void {
    this.permissions = this.permissions.filter((permission) => permission !== permissionToRemove);
  }

  /**
   * Getter title
   * @return {string}
   */
  public get title(): string {
    return this._title;
  }

  /**
   * Getter permissions
   * @return {Permission[]}
   */
  public get permissions(): Permission[] {
    return this._permissions;
  }

  /**
   * Setter title
   * @param {string} value
   */
  public set title(value: string) {
    this._title = value;
  }

  /**
   * Setter permissions
   * @param {Permission[]} value
   */
  public set permissions(value: Permission[]) {
    this._permissions = value;
  }
}
