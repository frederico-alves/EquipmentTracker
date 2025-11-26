using Microsoft.EntityFrameworkCore;
using EquipmentTracker.Api.Data;
using EquipmentTracker.Api.Services;
using EquipmentTracker.Api.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
// Register DbContext - one instance per HTTP request (Scoped)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register service - interface maps to implementation
builder.Services.AddScoped<IEquipmentService, EquipmentService>();
//                             └── interface        └── implementation

// SignalR - Add real-time capabilities
builder.Services.AddSignalR();

// CORS (allow frontend to call API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                // Reads from appsettings.json: FrontendUrl
                builder.Configuration.GetValue<string>("FrontendUrl") ?? "http://localhost:5173"
            )
            .AllowAnyHeader()       // Accept any HTTP headers
            .AllowAnyMethod()       // Accept GET, POST, PUT, DELETE
            .AllowCredentials();    // Required for SignalR
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

// Use HTTP for simplicity
// Uncomment for HTTPS:
// app.UseHttpsRedirection();

app.UseCors("AllowFrontend");
app.MapControllers();

// Map SignalR hub endpoint
app.MapHub<EquipmentHub>("/hubs/equipment");

// Create database and seed data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // Update to Migrations here in production:
    db.Database.EnsureCreated(); // Creates DB and tables if they don't exist - quick for development
}

app.Run();