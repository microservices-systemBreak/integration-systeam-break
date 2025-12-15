using Microsoft.EntityFrameworkCore;
using vuln.Domain.Entities;

namespace vuln.Infrastructure.Data
{
    // Database context for the vulnerability analyzer service.
    public class VulnDbContext : DbContext
    {
        public VulnDbContext(DbContextOptions<VulnDbContext> options) : base(options) { }

        // DbSet for CVE entries.
        public DbSet<CveEntry> CveEntries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<CveEntry>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.CveId).IsUnique();
                entity.HasIndex(e => e.PackageName);

                entity.Property(e => e.CveId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.PackageName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.VulnerableVersionRange).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Severity).IsRequired().HasMaxLength(50);
                entity.Property(e => e.CvssScore).HasColumnType("decimal(3, 1)");
            });
        }
    }
}