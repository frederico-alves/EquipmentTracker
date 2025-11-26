using Microsoft.EntityFrameworkCore;
using EquipmentTracker.Api.Models;
using EquipmentTracker.Api.Data;

namespace EquipmentTracker.Api.Data;

// : inherits from DbContext
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Object-relational Mapping (ORM) - Microsoft.EntityFrameworkCore
    // DbSet<T> represents a table in the database: Add(); Remove(); Find(); .Where(); .Select()
    public DbSet<Equipment> Equipment => Set<Equipment>();
    public DbSet<StateChange> StateChanges => Set<StateChange>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        // Configure Equipment table
        modelBuilder.Entity<Equipment>(entity =>
        {
            // Fluent API (Mapping properties and types):
            // entity.Property(e => e.Name)    // Configure "Name" property
            // .HasColumnName("name")       // Database column is "name" (lowercase)
            // .HasMaxLength(100)           // VARCHAR(100)
            // .IsRequired();               // NOT NULL

            entity.ToTable("equipment");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id").HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Location).HasColumnName("location").HasMaxLength(100).IsRequired();
            entity.Property(e => e.CurrentState).HasColumnName("current_state").IsRequired();
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("NOW()");
            entity.Property(e => e.UpdateAt).HasColumnName("updated_at").HasDefaultValueSql("NOW()");
        });

        // Configure StateChange table
        modelBuilder.Entity<StateChange>(entity =>
        {
            entity.ToTable("state_changes");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id").HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.EquipmentId).HasColumnName("equipment_id").IsRequired();
            entity.Property(e => e.PreviousState).HasColumnName("previous_state").IsRequired();
            entity.Property(e => e.NewState).HasColumnName("new_state").IsRequired();
            entity.Property(e => e.ChangeBy).HasColumnName("changed_by").HasMaxLength(100).IsRequired();
            entity.Property(e => e.ChangedAt).HasColumnName("changed_at").HasDefaultValueSql("NOW()");
            entity.Property(e => e.Notes).HasColumnName("notes");

            // Define relationship
            // entity.HasOne(e => e.Equipment)      // StateChange has ONE Equipment
            //     .WithMany(eq => eq.StateChanges) // Equipment has MANY StateChanges
            //     .HasForeignKey(e => e.EquipmentId) // FK column is EquipmentId
            //     .OnDelete(DeleteBehavior.Cascade); // Delete changes when equipment is deleted
            
            entity.HasOne(e => e.Equipment)
                .WithMany(eq => eq.StateChanges)
                .HasForeignKey(e => e.EquipmentId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        var equipmentIds = new []
        {
            Guid.Parse("11111111-1111-1111-1111-111111111111"),
            Guid.Parse("22222222-2222-2222-2222-222222222222"),
            Guid.Parse("33333333-3333-3333-3333-333333333333")
        };

        // Seed initial data
        // modelBuilder.Entity<Equipment>().HasData(
        //     new Equipment { Id = equipmentIds[0], Name = "Molding Machine A1", ... }
        // );

        modelBuilder.Entity<Equipment>().HasData(
            new Equipment
            {
                Id = equipmentIds[0],
                Name = "Molding Machine A1",
                Location = "Hall 1 - Section A",
                CurrentState = Models.Enums.ProductionState.Green 
            },
            new Equipment
            {
                Id = equipmentIds[1],
                Name = "Molding Machine A2",
                Location = "Hall 1 - Section A",
                CurrentState = Models.Enums.ProductionState.Yellow
            },
            new Equipment
            {
                Id = equipmentIds[2],
                Name = "Packaging Line B1",
                Location = "Hall 2 - Section B",
                CurrentState = Models.Enums.ProductionState.Red
            }
        );
    }
}