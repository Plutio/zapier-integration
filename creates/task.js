const sample = require('../samples/sample_task');
const prepareErrorMessage = require('../helpers/prepareErrorMessage');

const createTask = async (z, bundle) => {
  const {
    project_name,
    task_board,
    task_group,
    taskTitle,
    taskDescription,
  } = bundle.inputData;

  const {
    business,
    client_id,
    client_secret,
  } = bundle.authData;

  var authOptions = {
    "method": "POST",
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded",
      "Business": business,
    },
    "body": {
      "client_id": client_id,
      "client_secret": client_secret,
      "grant_type": "client_credentials"
    }
  }

  const response = await z.request("https://api.plutio.com/v1/oauth/token", authOptions);
  response.throwForStatus();

  const results = z.JSON.parse(response.content);

  const createTaskOptions = {
      "method": "POST",
      "headers": {
        "Authorization" : "Bearer " + results.accessToken,
        "Content-Type": "application/json",
        "Business": business,
      },
      "body": {
        "taskGroupId": task_group,
        "title": taskTitle,
        "description": taskDescription,
        "descriptionText": taskDescription,
        "hasDescription": true,
      }
  }

  const createTaskResponse = await z.request("https://api.plutio.com/v1/tasks", createTaskOptions)
  createTaskResponse.throwForStatus();

  return {ok: true};
};

module.exports = {
  key: 'task',
  noun: 'Task',

  display: {
    label: 'Create Task',
    description: 'Creates Plutio Task.'
  },

  operation: {
    inputFields: [
      async function(z, bundle) {
        const { client_secret, client_id, business } = bundle.authData;

        var options = {
          "method": "POST",
          "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Business": business,
          },
          "body": {
            "client_id": client_id,
            "client_secret": client_secret,
            "grant_type": "client_credentials"
          }
        }

        const response = await z.request("https://api.plutio.com/v1/oauth/token", options)
        response.throwForStatus();

        const results = z.JSON.parse(response.content);

        const projectsOptions = {
            "method": "GET",
            "headers": {
              "Authorization" : "Bearer " + results.accessToken,
              "Content-Type": "application/json",
              "Business": business,
            },
            "body": {
              "client_id": client_id,
            }
        }

        const projectsResponse = await z.request("https://api.plutio.com/v1/projects", projectsOptions)
        projectsResponse.throwForStatus();

        const projectResults = z.JSON.parse(projectsResponse.content);

        const listOfProjects = {};

        projectResults.forEach(({name, _id}) => {
          listOfProjects[_id] = name;
        });

        return {
          key: 'project_name',
          type: 'text',
          label: 'Project Name',
          required: true,
          helpText: 'Name of the project',
          placeholder: 'Select project',
          altersDynamicFields: true,
          choices: listOfProjects
        };
      },
      async function(z, bundle) {
        const { client_secret, client_id, business } = bundle.authData;

        var options = {
          "method": "POST",
          "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Business": business,
          },
          "body": {
            "client_id": client_id,
            "client_secret": client_secret,
            "grant_type": "client_credentials"
          }
        }

        const response = await z.request("https://api.plutio.com/v1/oauth/token", options)
        response.throwForStatus();

        const results = z.JSON.parse(response.content);

        const taskBoardsOptions = {
          "method": "GET",
          "headers": {
            "Authorization" : "Bearer " + results.accessToken,
            "Content-Type": "application/json",
            "Business": business,
          }
        }

        const taskBoardsResponse = await z.request("https://api.plutio.com/v1/task-boards", taskBoardsOptions)
        taskBoardsResponse.throwForStatus();

        const taskBoardsResult = z.JSON.parse(taskBoardsResponse.content);

        const listOfTaskBoards = {};

        taskBoardsResult.filter(({projectId}) => projectId === bundle.inputData.project_name).forEach(({title, _id}) => {
          listOfTaskBoards[_id] = title;
        });

        return {
          key: 'task_board',
          type: 'text',
          label: 'Task Board',
          required: true,
          altersDynamicFields: true,
          placeholder: 'Select task board',
          choices: listOfTaskBoards
        };
      },
      async function(z, bundle) {
        const { client_secret, client_id, business } = bundle.authData;

        var options = {
          "method": "POST",
          "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Business": business,
          },
          "body": {
            "client_id": client_id,
            "client_secret": client_secret,
            "grant_type": "client_credentials"
          }
        }

        const response = await z.request("https://api.plutio.com/v1/oauth/token", options)
        response.throwForStatus();

        const results = z.JSON.parse(response.content);

        const taskGroupsOptions = {
          "method": "GET",
          "headers": {
            "Authorization" : "Bearer " + results.accessToken,
            "Content-Type": "application/json",
            "Business": business,
          },
          "body": {
            "client_id": client_id,
          }
        }

        const taskGroupsResponse = await z.request("https://api.plutio.com/v1/task-groups", taskGroupsOptions)
        taskGroupsResponse.throwForStatus();

        const taskGroupsResult = z.JSON.parse(taskGroupsResponse.content);

        const listOfTaskGroups = {};

        taskGroupsResult.filter(({taskBoardId}) => taskBoardId === bundle.inputData.task_board).forEach(({title, _id}) => {
          listOfTaskGroups[_id] = title;
        });

        return {
          key: 'task_group',
          type: 'text',
          label: 'Task Group',
          required: true,
          placeholder: 'Select task group',
          altersDynamicFields: true,
          choices: listOfTaskGroups
        };
      },
      {
        key: 'taskTitle',
        label: 'Task title',
        type: 'text',
        required: true,
      },
      {
        key: 'taskDescription',
        label: 'Task description',
        type: 'text',
        required: true,
      },
    ],
    perform: createTask,
    sample
  }
};
