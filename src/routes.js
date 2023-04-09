import { randomUUID } from 'crypto';
import { Database } from './database/database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const tasks = database.select('tasks')
            return res.end(JSON.stringify(tasks));
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const {title, description} = req.body;
            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }

            database.insert('tasks', task)

            return res.writeHead(201).end();
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const {id} = req.params;
            const {title, description} = req.body;

            const taskExists = database.findById('tasks', id)

            if(!taskExists){
                return res.writeHead(404).end('task not found');
            }

            const updatedTask = Object.assign(
                {},
                taskExists,
                title && { title },
                description && { description },
                { updated_at: new Date().toISOString() }
              );

            database.update('tasks', id, updatedTask)

            return res.writeHead(204).end();
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const {id} = req.params;

            const taskExists = database.findById('tasks', id)

            if(!taskExists){
                return res.writeHead(404).end('task not found');
            }

            database.delete('tasks', id)

            return res.writeHead(204).end();
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const {id} = req.params;

            const taskExists = database.findById('tasks', id)

            if(!taskExists){
                return res.writeHead(404).end('task not found');
            }

            const updatedTask = Object.assign(
                {},
                taskExists,
                { updated_at: new Date().toISOString() },
                { completed_at: taskExists.completed_at ? null : new Date().toISOString()}
              );

            database.update('tasks', id, updatedTask)

            return res.writeHead(204).end();
        }
    }
]