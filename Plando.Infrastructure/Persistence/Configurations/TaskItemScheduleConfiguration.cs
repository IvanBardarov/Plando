using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Plando.Domain.Entities;

namespace Plando.Infrastructure.Persistence.Configurations;

public class TaskItemScheduleConfiguration : IEntityTypeConfiguration<TaskItemSchedule>
{
    ///<summary>
    /// Configures the entity mapping for <see cref="TaskItemSchedule"/>
    /// to the database table,
    /// including properties, indexes and relationships.
    /// </summary>
    public void Configure(EntityTypeBuilder<TaskItemSchedule> taskItemSchedules)
    {
        // table
        taskItemSchedules.ToTable("TaskItemSchedules");

        // primary key
        taskItemSchedules.HasKey(taskItemSchedule => taskItemSchedule.Id);

        // properties
        taskItemSchedules
            .Property(taskItemSchedule => taskItemSchedule.TaskItemId).IsRequired();
        taskItemSchedules
            .Property(taskItemSchedule => taskItemSchedule.Date).IsRequired();
        taskItemSchedules
            .Property(taskItemSchedule => taskItemSchedule.StartTime).IsRequired();
        taskItemSchedules
            .Property(taskItemSchedule => taskItemSchedule.EndTime).IsRequired();

        // relations one-to-many
        taskItemSchedules
            .HasOne(taskItemSchedule => taskItemSchedule.TaskItem)
            .WithMany()
            .HasForeignKey(taskItemSchedule => taskItemSchedule.TaskItemId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}