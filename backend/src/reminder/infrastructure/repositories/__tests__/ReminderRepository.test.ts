import { ReminderRepository } from "../ReminderRepository";
import { IReminderRepository } from "../../../application/repositories";

describe("ReminderRepository", () => {
  let reminderRepository: IReminderRepository;

  beforeAll(() => {
    reminderRepository = new ReminderRepository();
  });

  describe('GIVEN "reminder" object', () => {
    describe("WHEN save first time", () => {
      it("THEN should persist reminder", async () => {
        await reminderRepository.save();
      });
    });
  });
});
