import { ParentChildService } from "../parent-child/parent-child.service";
import { Injectable } from "@angular/core";
import * as firebase from "firebase";
import * as lodash from "lodash";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root"
})
export class FirebaseService {
  projects: any;
  subscriptionProjectDelete: any;

  constructor(private authSvc: AuthService, public parentChildSvc: ParentChildService) {

    this.authSvc.getUser().then((user: any) => {
      // On new project add
      firebase.database().ref("/projects").orderByChild("userID").equalTo(user.uid).on("child_added", (data) => {
        const newChild = data.val();
        newChild.id = data.key;
        this.parentChildSvc.publish("newProjectAdded", newChild);
      });

      // On project delete
      firebase.database().ref("/projects").orderByChild("userID").equalTo(user.uid).on("child_removed", (data) => {
        this.parentChildSvc.publish("projectDeleted", data.key);
      });

      // On new task add (into project)
      firebase.database().ref("/projects").orderByChild("userID").equalTo(user.uid).on("child_changed", (data) => {
        console.log(data.val());
        const changedProject = data.val();
        this.parentChildSvc.publish("projectUpdate", changedProject);
      });

    });

    this.subscriptionProjectDelete = this.parentChildSvc.on("deleteProject").subscribe((project) => this.deleteProject(project));

  }

  // Projects
  addNewProject(projectData: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.authSvc.getUser();
        const newProjectResponse: any = await firebase.database().ref("projects").push({
          userID: user.uid,
          name: projectData.name
        });
        return resolve(newProjectResponse);
      } catch (error) {
        console.log(error);
        return reject(error);
      }
    });
  }

  getProjects() {
    return new Promise(async (resolve, reject) => {
      const projects: any = [];
      try {
        const user = await this.authSvc.getUser();

        firebase.database().ref("/projects").orderByChild("userID").equalTo(user.uid).once("value", (records) => {
          records.forEach(function (record) {
            const key = record.key;
            const data = record.val();
            data.id = key;
            projects.push(data);
          });

          return resolve(projects);
        });
      } catch (error) {
        return resolve(projects);
      }
    });
  }

  deleteProject(project: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.authSvc.getUser();
        const newProjectResponse: any = await firebase.database().ref("projects").child(project.id).remove();
        return resolve();
      } catch (error) {
        console.log(error);
        return reject(error);
      }
    });
  }

  // Tasks
  addnewTask(taskData: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.authSvc.getUser();
        const newTaskResponse: any = await firebase.database().ref("projects/" + taskData.projectID + "/tasks").push({
          userID: user.uid,
          projectID: taskData.projectID,
          name: taskData.name,
          description: taskData.description ? taskData.description : "",
          dueTime: taskData.dueTimeFormatted ? taskData.dueTimeFormatted : "",
          dueDateUS: taskData.dueDateUS ? taskData.dueDateUS : "",
          dueDateEU: taskData.dueDateEU ? taskData.dueDateEU : ""
        });
        return resolve(newTaskResponse);
      } catch (error) {
        console.log(error);
        return reject(error);
      }
    });
  }

  deleteTask(task: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const deleteTaskResponse: any = await firebase.database().ref("projects/" + task.projectID + "/tasks").child(task.taskID).remove();
        return resolve();
      } catch (error) {
        console.log(error);
        return reject(error);
      }
    });
  }
}
