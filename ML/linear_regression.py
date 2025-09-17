import numpy as np
from datetime import datetime, timedelta

distances = np.array([1.0, 3.0, 3.1, 4.7, 5.5, 6.1])
times = np.array([2.0, 4.0, 6.0, 8.0, 10.0, 12.0])

# start time
start_time = datetime.now()

N = len(distances)

sum_x = distances.sum()
sum_y = times.sum()
sum_xy = (distances * times).sum()
sum_x2 = (distances**2).sum()

m = (N * sum_xy - sum_x * sum_y) / (N * sum_x2 - sum_x**2)
b = (sum_y - m * sum_x) / N

distance_range = np.linspace(0, 12, 100)
predicted_times = m * distance_range + b

distance_to_predict = 8.0
pred_time_at_8km = m * distance_to_predict + b

# arrival time
arrival_time = start_time + timedelta(minutes=pred_time_at_8km)

print(f"Expected arrival: {arrival_time.strftime('%Y-%m-%d %H:%M:%S')}")
