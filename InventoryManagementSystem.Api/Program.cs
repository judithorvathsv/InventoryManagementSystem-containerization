using InventoryManagementSystem.Api;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();    
    });
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseDeveloperExceptionPage();

app.UseCors("AllowFrontend");

// Migration + seed: for every startup
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
var logger = services.GetRequiredService<ILogger<Program>>();

try
{
    // 1. Save connection string
    var defaultConn = builder.Configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Missing DefaultConnection string");
    var masterConnectionString = defaultConn.Replace("Database=inventory-db;", "Database=master;");

    // 2. Master context → DROP + CREATE
    using var masterContext = new ApplicationDbContext(
        new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlServer(masterConnectionString)
            .Options);

    masterContext.Database.ExecuteSqlRaw("""
        IF EXISTS (SELECT name FROM sys.databases WHERE name = 'inventory-db')
        BEGIN
            ALTER DATABASE [inventory-db] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
            DROP DATABASE [inventory-db];
        END
    """);

    masterContext.Database.ExecuteSqlRaw("CREATE DATABASE [inventory-db];");

    // 3. New context for new database (new string)
    var newConnOptions = new DbContextOptionsBuilder<ApplicationDbContext>()
        .UseSqlServer(defaultConn)
        .Options;

    // Migrate
    using var freshContext = new ApplicationDbContext(newConnOptions);
    freshContext.Database.Migrate();

    logger.LogInformation("Migrations and seed applied successfully.");
}
catch (Exception ex)
{
    logger.LogError(ex, "Database reset failed");
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
