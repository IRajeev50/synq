import pg from 'pg';
const {Pool}=pg;
const collections=['users','sessions','tokens','candidates','connections','blocks'];
export class PostgresStateStore {
 constructor(url=process.env.DATABASE_URL){this.pool=url?new Pool({connectionString:url,max:5,ssl:process.env.NODE_ENV==='production'?{rejectUnauthorized:true}:false}):null;}
 async init(core){if(!this.pool)return {mode:'memory'};await this.pool.query(`CREATE TABLE IF NOT EXISTS app_state (key text PRIMARY KEY, value jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`);const {rows}=await this.pool.query(`SELECT value FROM app_state WHERE key='synq-core'`);if(rows[0])this.hydrate(core,rows[0].value);return {mode:'postgres'};}
 snapshot(core){const value={};for(const k of collections)value[k]=k==='blocks'?[...core[k]]:[...core[k].entries()];value.messages=core.messages;value.reports=core.reports;value.events=core.events;return value;}
 hydrate(core,v){for(const k of collections)core[k]=k==='blocks'?new Set(v[k]||[]):new Map(v[k]||[]);core.messages=v.messages||[];core.reports=v.reports||[];core.events=v.events||[];}
 async save(core){if(!this.pool)return;await this.pool.query(`INSERT INTO app_state(key,value,updated_at) VALUES('synq-core',$1,now()) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=now()`,[this.snapshot(core)]);}
 async health(){if(!this.pool)return {database:'memory'};await this.pool.query('SELECT 1');return {database:'postgres'};}
 async close(){await this.pool?.end();}
}
