import { IReminder, Reminder } from "../../reminder/domain";
import { faker } from "@faker-js/faker";
import { v4 } from "uuid";
import { VError } from "verror";

export class ReminderMock {
  public static create(): IReminder {
    const createReminderResult = Reminder.create(
      { note: faker.lorem.slug(), userId: v4() },
      { traceId: v4(), commandName: faker.lorem.slug() }
    );

    if (createReminderResult.isFailure()) {
      throw new VError(
        "Create reminder MOCK should be created",
        createReminderResult.getError()
      );
    }

    return createReminderResult.getData().reminder;
  }
}
