using Microsoft.EntityFrameworkCore;
using error.Domain.Entities;

namespace error.Infrastructure.Data
{
    // Database context for the error monitor service.
    public class ErrorDbContext : DbContext
    {
        public ErrorDbContext(DbContextOptions<ErrorDbContext> options) : base(options) { }

        // DbSet for error logs.
        public DbSet<ErrorLog> ErrorLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ErrorLog>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Service).HasMaxLength(100);
                entity.Property(e => e.CorrelationId).HasMaxLength(100);
                entity.Property(e => e.Level).HasMaxLength(50);
                
                entity.HasIndex(e => e.Service);
                entity.HasIndex(e => e.CorrelationId);
                entity.HasIndex(e => e.Timestamp);
            });
        }
    }
}