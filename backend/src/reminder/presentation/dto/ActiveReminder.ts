export interface IActiveReminderPropsDto {
  message: string;
  date: Date;
}

export class ActiveReminderDto {
  private readonly props: IActiveReminderPropsDto;

  private constructor(message: string, date: Date) {
    this.props = {
      message,
      date,
    };
  }

  public static create(message: string, date: Date): ActiveReminderDto {
    return new ActiveReminderDto(message, date);
  }

  getProps(): IActiveReminderPropsDto {
    return this.props;
  }
}
