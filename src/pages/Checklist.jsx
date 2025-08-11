import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Checklist = () => {
  const { id } = useParams();
  
  // Mock project data
  const project = {
    id: id,
    name: 'Downtown Restaurant Renovation',
    location: '123 Main St, San Francisco, CA',
  };

  // Mock checklist tasks with state management
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Submit Building Permit Application',
      description: 'Complete and submit the building permit application with architectural plans',
      completed: true,
      category: 'Building Permit',
      dueDate: '2025-08-05',
      priority: 'High',
    },
    {
      id: 2,
      title: 'Obtain Structural Engineering Plans',
      description: 'Get stamped structural engineering plans for load-bearing modifications',
      completed: true,
      category: 'Building Permit',
      dueDate: '2025-08-03',
      priority: 'High',
    },
    {
      id: 3,
      title: 'Schedule Building Department Inspection',
      description: 'Schedule initial inspection with building department',
      completed: false,
      category: 'Building Permit',
      dueDate: '2025-08-20',
      priority: 'High',
    },
    {
      id: 4,
      title: 'Submit Electrical Permit Application',
      description: 'Submit electrical permit application with electrical plans',
      completed: false,
      category: 'Electrical Permit',
      dueDate: '2025-08-12',
      priority: 'Medium',
    },
    {
      id: 5,
      title: 'Hire Licensed Electrician',
      description: 'Contract with licensed electrician for the electrical work',
      completed: false,
      category: 'Electrical Permit',
      dueDate: '2025-08-15',
      priority: 'Medium',
    },
    {
      id: 6,
      title: 'Obtain Plumbing Plans',
      description: 'Get detailed plumbing plans for kitchen and restroom updates',
      completed: false,
      category: 'Plumbing Permit',
      dueDate: '2025-08-18',
      priority: 'Medium',
    },
    {
      id: 7,
      title: 'Submit Plumbing Permit Application',
      description: 'Submit plumbing permit application to water department',
      completed: false,
      category: 'Plumbing Permit',
      dueDate: '2025-08-25',
      priority: 'Low',
    },
    {
      id: 8,
      title: 'ADA Compliance Review',
      description: 'Ensure all modifications meet ADA compliance requirements',
      completed: false,
      category: 'Compliance',
      dueDate: '2025-08-30',
      priority: 'High',
    },
  ]);

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  // Group tasks by category
  const tasksByCategory = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-6">
          <Link 
            to={`/project/${id}`}
            className="text-purple-600 hover:text-purple-500 font-medium mb-4 inline-flex items-center"
          >
            ← Back to Project
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-600 mt-1">Project Checklist</p>
        </div>

        {/* Progress Overview */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Progress Overview</h2>
            <span className="text-sm text-gray-600">
              {completedTasks} of {totalTasks} tasks completed
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="h-4 bg-gradient-to-r from-slate-500 via-slate-600 to-slate-700 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <div className="text-center">
            <span className="text-2xl font-bold gradient-text-emerald">
              {Math.round(progressPercentage)}%
            </span>
            <p className="text-gray-600">Complete</p>
          </div>
        </div>

        {/* Task Categories */}
        <div className="space-y-6">
          {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
            <div key={category} className="card overflow-hidden">
              <div className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 p-4">
                <h3 className="text-lg font-semibold text-white">{category}</h3>
                <p className="text-orange-100 text-sm">
                  {categoryTasks.filter(t => t.completed).length} of {categoryTasks.length} tasks completed
                </p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {categoryTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={`flex items-start space-x-4 p-4 rounded-lg border transition-all duration-200 ${
                        task.completed 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          task.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {task.completed && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      
                      <div className="flex-grow">
                        <div className="flex items-start justify-between">
                          <div className="flex-grow">
                            <h4 className={`font-medium ${task.completed ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                              {task.title}
                            </h4>
                            <p className={`text-sm mt-1 ${task.completed ? 'text-green-600' : 'text-gray-600'}`}>
                              {task.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-3">
                              <span className="text-sm text-gray-500">
                                Due: {task.dueDate}
                              </span>
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                                {task.priority} Priority
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button 
            onClick={() => {
              const incompleteTasks = tasks.filter(task => !task.completed);
              if (incompleteTasks.length > 0) {
                const nextTask = incompleteTasks[0];
                toggleTask(nextTask.id);
              }
            }}
            className="btn-gradient-rose px-6 py-3"
            disabled={completedTasks === totalTasks}
          >
            Mark Next Task Complete
          </button>
          
          <Link 
            to={`/project/${id}`}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Project
          </Link>
          
          <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors">
            Print Checklist
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checklist;
