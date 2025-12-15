using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace core.Infrastructure.Migrations
{
    [DbContext(typeof(core.Infrastructure.Data.CoreDbContext))]
    partial class CoreDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 63)
                .HasAnnotation("ProductVersion", "8.0.0");

            modelBuilder.Entity("core.Domain.Entities.EndpointState", b =>
            {
                b.Property<string>("EndpointId").HasColumnType("character varying(50)").HasMaxLength(50);
                b.Property<bool>("Online").HasColumnType("boolean");
                b.Property<DateTime?>("LastSeenAt").HasColumnType("timestamp without time zone");
                b.Property<DateTime?>("LastScanAt").HasColumnType("timestamp without time zone");
                b.Property<string>("LastOverallSeverity").HasColumnType("character varying(20)").HasMaxLength(20);
                b.HasKey("EndpointId");
                b.ToTable("EndpointsState");
            });

            modelBuilder.Entity("core.Domain.Entities.Job", b =>
            {
                b.Property<string>("JobId").HasColumnType("character varying(50)").HasMaxLength(50);
                b.Property<string>("Type").IsRequired().HasColumnType("character varying(20)").HasMaxLength(20);
                b.Property<string>("EndpointId").IsRequired().HasColumnType("character varying(50)").HasMaxLength(50);
                b.Property<string>("Action").HasColumnType("character varying(50)").HasMaxLength(50);
                b.Property<string>("Status").IsRequired().HasColumnType("character varying(20)").HasMaxLength(20);
                b.Property<string>("CorrelationId").IsRequired().HasColumnType("character varying(100)").HasMaxLength(100);
                b.Property<DateTime>("CreatedAt").HasColumnType("timestamp without time zone");
                b.Property<DateTime?>("UpdatedAt").HasColumnType("timestamp without time zone");
                b.Property<string>("ErrorMessage").HasColumnType("text");
                b.Property<DateTime?>("ScheduledAt").HasColumnType("timestamp without time zone");
                b.Property<string>("ScheduleType").HasColumnType("character varying(20)").HasMaxLength(20);
                b.HasKey("JobId");
                b.HasIndex("CorrelationId");
                b.HasIndex("EndpointId");
                b.HasIndex("Status");
                b.ToTable("Jobs");
            });
        }
    }
}
