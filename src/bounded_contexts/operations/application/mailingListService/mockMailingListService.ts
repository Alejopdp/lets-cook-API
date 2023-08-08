import { IMailingListService } from "./IMailingListService";

export class MockMailingListService implements IMailingListService {

    public async createSubscriber(newSubscriberEmail: string, data: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    public async subscribeTo(groupId: string, newSubscriberEmail: string, newSusbcriberFullName: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

    public async getSubscribersOfGorup(groupId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    public async getGroups(): Promise<any[]> {
        throw new Error("Method not implemented.");
    }

    public async getGroupById(): Promise<any> {
        throw new Error("Method not implemented.");
    }

    public async updateSubscriber(email: string, data: object): Promise<any> {
        return
    }
}