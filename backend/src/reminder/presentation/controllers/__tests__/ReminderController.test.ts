import { IReminderController } from "../reminderController.interface";
import { ReminderController } from "../ReminderController";
import { faker } from "@faker-js/faker";

describe("ReminderController tests", () => {
  const reminderController: IReminderController = new ReminderController();

  describe("GIVEN userId request", () => {
    const userId = faker.datatype.uuid();

    describe("WHEN message and date is appropriate", () => {
      const message = faker.lorem.slug(4);
      const date = faker.date.future();

      const res = {
        status: jest.fn().mockReturnValue({ send: jest.fn() }),
      };

      it("THEN should return 201 status", async () => {
        jest.spyOn(res.status(), "send");

        await reminderController.postCreateReminder(
          {
            body: {
              userId,
              message,
              date,
            } as any,
          } as any,
          res as any
        );
      });
    });
  });
});
