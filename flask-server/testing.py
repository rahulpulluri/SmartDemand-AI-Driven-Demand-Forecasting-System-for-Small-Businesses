import matplotlib.pyplot as plt
import numpy as np
import datetime
import random

# Define sprint dates and total hours
sprint_start_date = datetime.date(2024, 9, 30)   # Sprint 1 Start
sprint_end_date = datetime.date(2024, 12, 1)    # Sprint 1 End
total_hours = 540
completed_hours = 0
remaining_hours = total_hours - completed_hours

# Generate a date range for Sprint 1
sprint_days = [sprint_start_date + datetime.timedelta(days=i) for i in range((sprint_end_date - sprint_start_date).days + 1)]

# Generate actual burndown with uneven progress (plateaus and steep drops)
remaining_work = [total_hours]
completed_work = [5, 0, 4, 6, 6, 2, 20, 4, 0, 18, 0, 24,2,19,20,0,0,0,24,20,5]
completed_work = completed_work + [0, 0, 0, 16, 0, 22, 20, 20, 8, 0, 0, 12,26,0,24,0,0,0,20,20,22]
completed_work = completed_work + [0, 0, 8, 0, 0, 0, 0, 0, 2, 14, 22, 8, 0,0,24,24,0,0,28,20,22]
for i in range(1, len(sprint_days)):
    print(len(sprint_days), len(completed_work))
    # # Random work completion per day (some days plateau, some days steep drop)
    # if random.random() > 0.7:
    #     daily_completion = random.randint(30, 50)  # steep drop
    # elif random.random() > 0.5:
    #     daily_completion = 0  # plateau
    # else:
    #     daily_completion = random.randint(10, 20)  # small progress
    #
    # if remaining_work[-1] - daily_completion < remaining_hours:
    #     daily_completion = remaining_work[-1] - remaining_hours  # avoid going below target
    #
    # remaining_work.append(remaining_work[-1] - daily_completion)
    remaining_work.append(remaining_work[-1] - completed_work[i-1])

# Ideal burndown (linear progression)
ideal_hours = np.linspace(total_hours, completed_hours, len(sprint_days))

# Plotting the burndown chart
plt.figure(figsize=(18, 10))
# plt.style.use('dark_background')

# Plot ideal burndown line
plt.plot(sprint_days, ideal_hours, label='Ideal Progress', color='green', linestyle='--', marker='o')

# Plot actual burndown line
plt.plot(sprint_days, remaining_work, label='Actual Progress', color='orange', linestyle='-', marker='o')

# Chart details
plt.title('All sprints - Burndown Chart', fontsize=16)
plt.xlabel('Sprint Dates', fontsize=12)
plt.ylabel('Remaining Work Hours', fontsize=12)
plt.xticks(sprint_days, [date.strftime("%b %d") for date in sprint_days], rotation=45)
plt.yticks(np.arange(0, total_hours + 50, 100))
plt.grid(True, color='gray', linestyle='-', linewidth=0.5)

# Show legend
plt.legend(loc='upper right', fontsize=10)

# Display chart
plt.tight_layout()
plt.show()