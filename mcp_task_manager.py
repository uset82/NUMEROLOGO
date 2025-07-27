#!/usr/bin/env python3
"""
MCP Task Manager Server
A simple task management server implementing the Model Context Protocol
"""

import asyncio
import json
import sys
from typing import Any, Dict, List, Optional
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Task:
    def __init__(self, id: str, title: str, description: str = "", status: str = "pending", priority: str = "medium"):
        self.id = id
        self.title = title
        self.description = description
        self.status = status  # pending, in_progress, completed
        self.priority = priority  # low, medium, high
        self.created_at = datetime.now().isoformat()
        self.updated_at = datetime.now().isoformat()
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "priority": self.priority,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

class TaskManager:
    def __init__(self):
        self.tasks: Dict[str, Task] = {}
        self.next_id = 1
    
    def create_task(self, title: str, description: str = "", priority: str = "medium") -> Task:
        task_id = str(self.next_id)
        self.next_id += 1
        task = Task(task_id, title, description, "pending", priority)
        self.tasks[task_id] = task
        return task
    
    def get_task(self, task_id: str) -> Optional[Task]:
        return self.tasks.get(task_id)
    
    def get_all_tasks(self) -> List[Task]:
        return list(self.tasks.values())
    
    def update_task(self, task_id: str, **kwargs) -> Optional[Task]:
        task = self.tasks.get(task_id)
        if task:
            for key, value in kwargs.items():
                if hasattr(task, key):
                    setattr(task, key, value)
            task.updated_at = datetime.now().isoformat()
        return task
    
    def delete_task(self, task_id: str) -> bool:
        return self.tasks.pop(task_id, None) is not None

class MCPTaskManagerServer:
    def __init__(self):
        self.task_manager = TaskManager()
        self.tools = [
            {
                "name": "create_task",
                "description": "Create a new task",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string", "description": "Task title"},
                        "description": {"type": "string", "description": "Task description"},
                        "priority": {"type": "string", "enum": ["low", "medium", "high"], "description": "Task priority"}
                    },
                    "required": ["title"]
                }
            },
            {
                "name": "list_tasks",
                "description": "List all tasks",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "status": {"type": "string", "enum": ["pending", "in_progress", "completed"], "description": "Filter by status"}
                    }
                }
            },
            {
                "name": "update_task",
                "description": "Update an existing task",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "task_id": {"type": "string", "description": "Task ID"},
                        "title": {"type": "string", "description": "New title"},
                        "description": {"type": "string", "description": "New description"},
                        "status": {"type": "string", "enum": ["pending", "in_progress", "completed"], "description": "New status"},
                        "priority": {"type": "string", "enum": ["low", "medium", "high"], "description": "New priority"}
                    },
                    "required": ["task_id"]
                }
            },
            {
                "name": "delete_task",
                "description": "Delete a task",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "task_id": {"type": "string", "description": "Task ID to delete"}
                    },
                    "required": ["task_id"]
                }
            }
        ]
    
    async def handle_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        method = request.get("method")
        params = request.get("params", {})
        
        if method == "initialize":
            return {
                "jsonrpc": "2.0",
                "id": request.get("id"),
                "result": {
                    "protocolVersion": "2024-11-05",
                    "capabilities": {
                        "tools": {"listChanged": True}
                    },
                    "serverInfo": {
                        "name": "quickapi-task-manager",
                        "version": "1.0.0"
                    }
                }
            }
        
        elif method == "tools/list":
            return {
                "jsonrpc": "2.0",
                "id": request.get("id"),
                "result": {"tools": self.tools}
            }
        
        elif method == "tools/call":
            tool_name = params.get("name")
            arguments = params.get("arguments", {})
            
            try:
                if tool_name == "create_task":
                    task = self.task_manager.create_task(
                        title=arguments["title"],
                        description=arguments.get("description", ""),
                        priority=arguments.get("priority", "medium")
                    )
                    return {
                        "jsonrpc": "2.0",
                        "id": request.get("id"),
                        "result": {
                            "content": [
                                {
                                    "type": "text",
                                    "text": f"Task created successfully: {json.dumps(task.to_dict(), indent=2)}"
                                }
                            ]
                        }
                    }
                
                elif tool_name == "list_tasks":
                    tasks = self.task_manager.get_all_tasks()
                    status_filter = arguments.get("status")
                    if status_filter:
                        tasks = [t for t in tasks if t.status == status_filter]
                    
                    tasks_data = [task.to_dict() for task in tasks]
                    return {
                        "jsonrpc": "2.0",
                        "id": request.get("id"),
                        "result": {
                            "content": [
                                {
                                    "type": "text",
                                    "text": f"Tasks: {json.dumps(tasks_data, indent=2)}"
                                }
                            ]
                        }
                    }
                
                elif tool_name == "update_task":
                    task_id = arguments["task_id"]
                    update_data = {k: v for k, v in arguments.items() if k != "task_id"}
                    task = self.task_manager.update_task(task_id, **update_data)
                    
                    if task:
                        return {
                            "jsonrpc": "2.0",
                            "id": request.get("id"),
                            "result": {
                                "content": [
                                    {
                                        "type": "text",
                                        "text": f"Task updated successfully: {json.dumps(task.to_dict(), indent=2)}"
                                    }
                                ]
                            }
                        }
                    else:
                        return {
                            "jsonrpc": "2.0",
                            "id": request.get("id"),
                            "error": {
                                "code": -1,
                                "message": f"Task with ID {task_id} not found"
                            }
                        }
                
                elif tool_name == "delete_task":
                    task_id = arguments["task_id"]
                    success = self.task_manager.delete_task(task_id)
                    
                    if success:
                        return {
                            "jsonrpc": "2.0",
                            "id": request.get("id"),
                            "result": {
                                "content": [
                                    {
                                        "type": "text",
                                        "text": f"Task {task_id} deleted successfully"
                                    }
                                ]
                            }
                        }
                    else:
                        return {
                            "jsonrpc": "2.0",
                            "id": request.get("id"),
                            "error": {
                                "code": -1,
                                "message": f"Task with ID {task_id} not found"
                            }
                        }
                
                else:
                    return {
                        "jsonrpc": "2.0",
                        "id": request.get("id"),
                        "error": {
                            "code": -32601,
                            "message": f"Unknown tool: {tool_name}"
                        }
                    }
            
            except Exception as e:
                return {
                    "jsonrpc": "2.0",
                    "id": request.get("id"),
                    "error": {
                        "code": -1,
                        "message": str(e)
                    }
                }
        
        else:
            return {
                "jsonrpc": "2.0",
                "id": request.get("id"),
                "error": {
                    "code": -32601,
                    "message": f"Unknown method: {method}"
                }
            }

async def main():
    server = MCPTaskManagerServer()
    
    logger.info("MCP Task Manager Server starting...")
    
    try:
        while True:
            # Read JSON-RPC request from stdin
            line = await asyncio.get_event_loop().run_in_executor(None, sys.stdin.readline)
            if not line:
                break
            
            try:
                request = json.loads(line.strip())
                response = await server.handle_request(request)
                
                # Write JSON-RPC response to stdout
                print(json.dumps(response), flush=True)
                
            except json.JSONDecodeError as e:
                logger.error(f"Invalid JSON received: {e}")
                error_response = {
                    "jsonrpc": "2.0",
                    "id": None,
                    "error": {
                        "code": -32700,
                        "message": "Parse error"
                    }
                }
                print(json.dumps(error_response), flush=True)
            
            except Exception as e:
                logger.error(f"Unexpected error: {e}")
                error_response = {
                    "jsonrpc": "2.0",
                    "id": None,
                    "error": {
                        "code": -32603,
                        "message": "Internal error"
                    }
                }
                print(json.dumps(error_response), flush=True)
    
    except KeyboardInterrupt:
        logger.info("Server shutting down...")
    except Exception as e:
        logger.error(f"Server error: {e}")

if __name__ == "__main__":
    asyncio.run(main())