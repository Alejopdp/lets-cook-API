export interface IMailingListService {
    createSubscriber(newSubscriberEmail: string, data: any): Promise<any>
    subscribeTo(groupId: string, newSubscriberEmail: string, newSusbcriberFullName: string): Promise<string>;
    getSubscribersOfGorup(groupId: string): Promise<any>;
    getGroups(): Promise<any[]>;
    getGroupById(): Promise<any>;
    updateSubscriber(email: string, data: object): Promise<any>
}
