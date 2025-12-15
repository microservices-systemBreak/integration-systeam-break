namespace core.Infrastructure.Data;

using Microsoft.EntityFrameworkCore;
using core.Domain.Entities;

/// <summary>
/// Database context for the core orchestrator microservice.
/// </summary>
public class CoreDbContext : DbContext
{
    public CoreDbContext(DbContextOptions<CoreDbContext> options) : base(options) { }
    
    public DbSet<Job> Jobs { get; set; }
    public DbSet<EndpointState> EndpointsState { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Job entity configuration
        modelBuilder.Entity<Job>(entity =>
        {
            entity.HasKey(e => e.JobId);
            entity.Property(e => e.JobId).HasMaxLength(50);
            entity.Property(e => e.Type).HasMaxLength(20).IsRequired();
            entity.Property(e => e.EndpointId).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Action).HasMaxLength(50);
            entity.Property(e => e.Status).HasMaxLength(20).IsRequired();
            entity.Property(e => e.CorrelationId).HasMaxLength(100).IsRequired();
            entity.Property(e => e.ScheduleType).HasMaxLength(20);
            
            entity.HasIndex(e => e.CorrelationId);
            entity.HasIndex(e => e.EndpointId);
            entity.HasIndex(e => e.Status);
        });
        
        // EndpointState entity configuration
        modelBuilder.Entity<EndpointState>(entity =>
        {
            entity.HasKey(e => e.EndpointId);
            entity.Property(e => e.EndpointId).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Online).IsRequired();
            entity.Property(e => e.LastOverallSeverity).HasMaxLength(20).IsRequired();
            
            entity.HasIndex(e => e.Online);
            entity.HasIndex(e => e.LastOverallSeverity);
        });
    }
}