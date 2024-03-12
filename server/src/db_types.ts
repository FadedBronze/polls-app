import { ColumnType, Generated, Insertable, JSONColumnType, Selectable, Updateable } from "kysely";

export interface Database {
  users: UserTable,
  sessions: SessionTable,
}

export interface UserTable {
  id: Generated<number>
  email: string
  password: string
  created: Date
  name: string
  session_id: number | null
}

export interface SessionTable {
  id: Generated<number>
  session_code: string
  csrf_token: string
  created: Date
}

export type NewUser = Insertable<UserTable>
export type GetUser = Selectable<UserTable>
export type UpdateUser = Updateable<UserTable>

export type NewSession = Insertable<SessionTable>
export type GetSession = Selectable<SessionTable>
export type UpdateSession = Updateable<SessionTable>