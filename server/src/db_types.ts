import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface Database {
  users: UserTable,
  sessions: SessionTable,
  polls: PollTable,
  choices: ChoiceTable,
}

export interface PollTable {
  user_id: number,
  id: Generated<number>,
  background: string,
  title_size: number,
  title: string,
  font_size: number,
  font: string,
  created: Date,
}

export interface ChoiceTable {
  votes: number,
  color: string,
  name: string,
  poll_id: number
}

export interface UserTable {
  id: Generated<number>
  email: string
  password: string
  created: Date
  name: string
  session_id: number | null
  voted_polls: number[]
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

export type NewPoll = Insertable<PollTable>
export type GetPoll = Selectable<PollTable>
export type UpdatePoll = Updateable<PollTable>

export type NewChoice = Insertable<ChoiceTable>
export type GetChoice = Selectable<ChoiceTable>
export type UpdateChoice = Updateable<ChoiceTable>