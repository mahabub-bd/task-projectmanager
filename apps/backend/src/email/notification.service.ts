import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

interface NotificationOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  // Task Notifications
  async sendTaskCreatedNotification(
    userEmail: string,
    userName: string,
    taskTitle: string,
    projectName: string,
    taskUrl: string,
    assignedBy?: string,
  ): Promise<void> {
    const html = this.getTaskCreatedTemplate(userName, taskTitle, projectName, taskUrl, assignedBy);
    await this.emailService.sendEmail({
      to: userEmail,
      subject: `New Task: ${taskTitle}`,
      html,
    });
    this.logger.log(`Task created notification sent to ${userEmail}`);
  }

  async sendTaskUpdatedNotification(
    userEmail: string,
    userName: string,
    taskTitle: string,
    changes: string[],
    taskUrl: string,
  ): Promise<void> {
    const html = this.getTaskUpdatedTemplate(userName, taskTitle, changes, taskUrl);
    await this.emailService.sendEmail({
      to: userEmail,
      subject: `Task Updated: ${taskTitle}`,
      html,
    });
    this.logger.log(`Task updated notification sent to ${userEmail}`);
  }

  async sendTaskCommentNotification(
    userEmail: string,
    userName: string,
    taskTitle: string,
    commenterName: string,
    commentText: string,
    taskUrl: string,
  ): Promise<void> {
    const html = this.getTaskCommentTemplate(userName, taskTitle, commenterName, commentText, taskUrl);
    await this.emailService.sendEmail({
      to: userEmail,
      subject: `New Comment on: ${taskTitle}`,
      html,
    });
    this.logger.log(`Task comment notification sent to ${userEmail}`);
  }

  async sendTaskDueSoonReminder(
    userEmail: string,
    userName: string,
    taskTitle: string,
    dueDate: Date,
    taskUrl: string,
  ): Promise<void> {
    const html = this.getTaskDueSoonTemplate(userName, taskTitle, dueDate, taskUrl);
    await this.emailService.sendEmail({
      to: userEmail,
      subject: `⏰ Task Due Soon: ${taskTitle}`,
      html,
    });
    this.logger.log(`Task due soon reminder sent to ${userEmail}`);
  }

  async sendTaskOverdueNotification(
    userEmail: string,
    userName: string,
    taskTitle: string,
    dueDate: Date,
    taskUrl: string,
  ): Promise<void> {
    const html = this.getTaskOverdueTemplate(userName, taskTitle, dueDate, taskUrl);
    await this.emailService.sendEmail({
      to: userEmail,
      subject: `⚠️ Task Overdue: ${taskTitle}`,
      html,
    });
    this.logger.log(`Task overdue notification sent to ${userEmail}`);
  }

  async sendTaskCompletedNotification(
    userEmail: string,
    userName: string,
    taskTitle: string,
    completedBy: string,
    taskUrl: string,
  ): Promise<void> {
    const html = this.getTaskCompletedTemplate(userName, taskTitle, completedBy, taskUrl);
    await this.emailService.sendEmail({
      to: userEmail,
      subject: `✅ Task Completed: ${taskTitle}`,
      html,
    });
    this.logger.log(`Task completed notification sent to ${userEmail}`);
  }

  // Project Notifications
  async sendProjectCreatedNotification(
    userEmail: string,
    userName: string,
    projectName: string,
    projectUrl: string,
    createdBy: string,
  ): Promise<void> {
    const html = this.getProjectCreatedTemplate(userName, projectName, projectUrl, createdBy);
    await this.emailService.sendEmail({
      to: userEmail,
      subject: `New Project: ${projectName}`,
      html,
    });
    this.logger.log(`Project created notification sent to ${userEmail}`);
  }

  async sendProjectUpdatedNotification(
    userEmail: string,
    userName: string,
    projectName: string,
    changes: string[],
    projectUrl: string,
  ): Promise<void> {
    console.log(`[Email Notification] sendProjectUpdatedNotification called for ${userEmail}, project: ${projectName}`);
    const html = this.getProjectUpdatedTemplate(userName, projectName, changes, projectUrl);
    await this.emailService.sendEmail({
      to: userEmail,
      subject: `Project Updated: ${projectName}`,
      html,
    });
    this.logger.log(`Project updated notification sent to ${userEmail}`);
  }

  async sendMilestoneCompletedNotification(
    userEmail: string,
    userName: string,
    milestoneName: string,
    projectName: string,
    projectUrl: string,
  ): Promise<void> {
    const html = this.getMilestoneCompletedTemplate(userName, milestoneName, projectName, projectUrl);
    await this.emailService.sendEmail({
      to: userEmail,
      subject: `🎉 Milestone Completed: ${milestoneName}`,
      html,
    });
    this.logger.log(`Milestone completed notification sent to ${userEmail}`);
  }

  async sendMilestoneDueSoonReminder(
    userEmail: string,
    userName: string,
    milestoneName: string,
    projectName: string,
    dueDate: Date,
    projectUrl: string,
  ): Promise<void> {
    const html = this.getMilestoneDueSoonTemplate(userName, milestoneName, projectName, dueDate, projectUrl);
    await this.emailService.sendEmail({
      to: userEmail,
      subject: `⏰ Milestone Due Soon: ${milestoneName}`,
      html,
    });
    this.logger.log(`Milestone due soon reminder sent to ${userEmail}`);
  }

  // Email Templates
  private getTaskCreatedTemplate(
    name: string,
    taskTitle: string,
    projectName: string,
    taskUrl: string,
    assignedBy?: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Task Assigned</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .task-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 New Task Assigned</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${name}</strong>,</p>
              ${assignedBy ? `<p><strong>${assignedBy}</strong> has assigned you a new task.</p>` : '<p>You have been assigned a new task.</p>'}

              <div class="task-card">
                <h3 style="margin-top: 0;">${taskTitle}</h3>
                <p><strong>Project:</strong> ${projectName}</p>
              </div>

              <div style="text-align: center;">
                <a href="${taskUrl}" class="button">View Task Details</a>
              </div>

              <p>Please log in to review the task details and start working.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Project & Task Management. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getTaskUpdatedTemplate(
    name: string,
    taskTitle: string,
    changes: string[],
    taskUrl: string,
  ): string {
    const changesList = changes.map(change => `<li>${change}</li>`).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Task Updated</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #00f2fe; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .changes-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .changes-box ul { margin: 0; padding-left: 20px; }
            .changes-box li { margin: 8px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📝 Task Updated</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${name}</strong>,</p>
              <p>The task <strong>${taskTitle}</strong> has been updated.</p>

              <div class="changes-box">
                <h4 style="margin-top: 0;">Changes:</h4>
                <ul>${changesList}</ul>
              </div>

              <div style="text-align: center;">
                <a href="${taskUrl}" class="button">View Task</a>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Project & Task Management. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getTaskCommentTemplate(
    name: string,
    taskTitle: string,
    commenterName: string,
    commentText: string,
    taskUrl: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Comment</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #fa709a; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .comment-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #fa709a; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💬 New Comment</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${name}</strong>,</p>
              <p><strong>${commenterName}</strong> commented on the task <strong>${taskTitle}</strong>.</p>

              <div class="comment-box">
                <p style="margin: 0; font-style: italic;">"${commentText}"</p>
              </div>

              <div style="text-align: center;">
                <a href="${taskUrl}" class="button">View Comment</a>
              </div>

              <p>Click the button above to reply and continue the conversation.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Project & Task Management. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getTaskDueSoonTemplate(
    name: string,
    taskTitle: string,
    dueDate: Date,
    taskUrl: string,
  ): string {
    const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const dueDateStr = dueDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Task Due Soon</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Task Due Soon</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${name}</strong>,</p>
              <p>Your task is due soon:</p>

              <div class="warning-box">
                <h3 style="margin-top: 0;">${taskTitle}</h3>
                <p><strong>Due Date:</strong> ${dueDateStr}</p>
                <p><strong>Time Remaining:</strong> ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}</p>
              </div>

              <div style="text-align: center;">
                <a href="${taskUrl}" class="button">View Task</a>
              </div>

              <p>Please make sure to complete it on time.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Project & Task Management. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getTaskOverdueTemplate(
    name: string,
    taskTitle: string,
    dueDate: Date,
    taskUrl: string,
  ): string {
    const dueDateStr = dueDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Task Overdue</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #f45c43; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .alert-box { background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 4px; color: #721c24; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Task Overdue</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${name}</strong>,</p>
              <p>The following task is now overdue:</p>

              <div class="alert-box">
                <h3 style="margin-top: 0;">${taskTitle}</h3>
                <p><strong>Was Due:</strong> ${dueDateStr}</p>
              </div>

              <div style="text-align: center;">
                <a href="${taskUrl}" class="button">View Task</a>
              </div>

              <p>Please complete this task as soon as possible.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Project & Task Management. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getTaskCompletedTemplate(
    name: string,
    taskTitle: string,
    completedBy: string,
    taskUrl: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Task Completed</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #38ef7d; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .success-box { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Task Completed</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${name}</strong>,</p>
              <p>Great news! The task <strong>${taskTitle}</strong> has been completed by <strong>${completedBy}</strong>.</p>

              <div class="success-box">
                <p style="margin: 0;">The task has been marked as completed and is ready for review.</p>
              </div>

              <div style="text-align: center;">
                <a href="${taskUrl}" class="button">View Task</a>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Project & Task Management. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getProjectCreatedTemplate(
    name: string,
    projectName: string,
    projectUrl: string,
    createdBy: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Project Created</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .project-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 New Project Created</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${name}</strong>,</p>
              <p><strong>${createdBy}</strong> has created a new project.</p>

              <div class="project-card">
                <h3 style="margin-top: 0;">${projectName}</h3>
              </div>

              <div style="text-align: center;">
                <a href="${projectUrl}" class="button">View Project</a>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Project & Task Management. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getProjectUpdatedTemplate(
    name: string,
    projectName: string,
    changes: string[],
    projectUrl: string,
  ): string {
    const changesList = changes.map(change => `<li>${change}</li>`).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Project Updated</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #00f2fe; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .changes-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Project Updated</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${name}</strong>,</p>
              <p>The project <strong>${projectName}</strong> has been updated.</p>

              <div class="changes-box">
                <h4 style="margin-top: 0;">Changes:</h4>
                <ul>${changesList}</ul>
              </div>

              <div style="text-align: center;">
                <a href="${projectUrl}" class="button">View Project</a>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Project & Task Management. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getMilestoneCompletedTemplate(
    name: string,
    milestoneName: string,
    projectName: string,
    projectUrl: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Milestone Completed</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .success-box { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Milestone Completed!</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${name}</strong>,</p>
              <p>Congratulations! The milestone <strong>${milestoneName}</strong> in project <strong>${projectName}</strong> has been completed!</p>

              <div class="success-box">
                <p style="margin: 0;">Great job reaching this goal! Keep up the excellent work.</p>
              </div>

              <div style="text-align: center;">
                <a href="${projectUrl}" class="button">View Project</a>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Project & Task Management. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getMilestoneDueSoonTemplate(
    name: string,
    milestoneName: string,
    projectName: string,
    dueDate: Date,
    projectUrl: string,
  ): string {
    const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const dueDateStr = dueDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Milestone Due Soon</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); color: #333; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #fcb69f; color: #333; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Milestone Due Soon</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${name}</strong>,</p>
              <p>A milestone in your project is due soon:</p>

              <div class="warning-box">
                <h3 style="margin-top: 0;">${milestoneName}</h3>
                <p><strong>Project:</strong> ${projectName}</p>
                <p><strong>Due Date:</strong> ${dueDateStr}</p>
                <p><strong>Time Remaining:</strong> ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}</p>
              </div>

              <div style="text-align: center;">
                <a href="${projectUrl}" class="button">View Project</a>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Project & Task Management. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
