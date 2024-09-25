using DotNetTaskAssignmentAppBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace DotNetTaskAssignmentAppBackend.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Email> Emails { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed users
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "Test",
                    Password = "Password1!"
                },
                new User
                {
                    Id = 2,
                    Username = "User",
                    Password = "Password1!"
                }
            );
        }
    }
}
