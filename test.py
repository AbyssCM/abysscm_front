import matplotlib
matplotlib.use("Qt5Agg")
import matplotlib.pyplot as plt
import matplotlib.animation as animation
import heapq
import random
import copy

# ------------------------
# 맵 정의 (0 = 로봇구역, 1 = 주차구역)
# ------------------------
parking_map = [
    [0,0,0,0,0,0,0,0,0],
    [0,1,1,1,0,1,1,1,0],
    [0,1,1,1,0,1,1,1,0],
    [0,1,1,1,0,1,1,1,0],
    [0,1,1,1,0,1,1,1,0],
    [0,1,1,1,0,1,1,1,0],
    [0,1,1,1,0,1,1,1,0],
    [0,1,1,1,0,1,1,1,0],
    [0,0,0,0,0,0,0,0,0],
]
rows = len(parking_map)
cols = len(parking_map[0])
cell_w, cell_h = 1.0, 2.0

def cell_center(r, c):
    return (c + 0.5, r * cell_h + cell_h/2)

# ------------------------
# 로봇 초기 위치 (왼쪽 상단)
# ------------------------
robot_starts = [(0,0),(0,1),(0,2)]
robots = [{'start': robot_starts[i], 'path': []} for i in range(3)]

# ------------------------
# 차량 위치
# ------------------------
cars = [(r,c) for r in range(rows) for c in range(cols) if parking_map[r][c]==1]

# ------------------------
# 회수 차량
# ------------------------
target_car = random.choice(cars)

# ------------------------
# 회수 위치 (오른쪽 상단)
# ------------------------
robot_zone = (0, cols-2)

# ------------------------
# A* 알고리즘
# ------------------------
def heuristic(a,b):
    return abs(a[0]-b[0])+abs(a[1]-b[1])

def astar(start, goal, grid, occupied=set()):
    R, C = len(grid), len(grid[0])
    open_set = []
    heapq.heappush(open_set, (heuristic(start,goal),0,start,[start]))
    visited = set()
    while open_set:
        f,cost,current,path = heapq.heappop(open_set)
        if current==goal:
            return path
        if current in visited:
            continue
        visited.add(current)
        r,c = current
        for dr,dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr,nc = r+dr, c+dc
            if 0<=nr<R and 0<=nc<C and (nr,nc) not in visited and (nr,nc) not in occupied:
                if grid[nr][nc]==0 or (nr,nc)==goal:
                    heapq.heappush(open_set,(cost+1+heuristic((nr,nc),goal),cost+1,(nr,nc),path+[(nr,nc)]))
    return None

# ------------------------
# 회수 차량 주변 임시 이동
# ------------------------
def find_temp_blocking(c, grid, cars_set):
    r,c0 = c
    # 주변 차량 중 하나만 선택
    for dr,dc in [(-1,0),(1,0),(0,-1),(0,1)]:
        nr,nc = r+dr, c0+dc
        if (nr,nc) in cars_set:
            return (nr,nc)
    return None

# ------------------------
# 로봇 순차 경로 생성
# ------------------------
all_robot_paths = []
temp_moves = []

for i,r in enumerate(robots):
    print(f"[로봇 {i+1}] 경로 생성 시작")
    occupied = set([ro['start'] for ro in robots if ro!=r]) | set(cars) - {target_car}
    path_to_car = astar(r['start'], target_car, parking_map, occupied)
    temp_moved = []

    # 경로 없으면 임시 차량 이동
    if path_to_car is None:
        temp_car = find_temp_blocking(target_car, parking_map, set(cars))
        if temp_car:
            temp_moved.append(temp_car)
            # 임시 위치 오른쪽 하단
            temp_pos = (rows-2, cols-2)
            # 이동 경로 생성
            temp_path = astar(temp_car, temp_pos, parking_map, occupied-{temp_car})
            if temp_path:
                print(f"[로봇 {i+1}] 임시 차량 이동: {temp_moved}")
                # 차량 이동 처리
                cars.remove(temp_car)
                cars.append(temp_pos)
                occupied.add(temp_pos)
                path_to_car = astar(r['start'], target_car, parking_map, occupied)
            else:
                raise RuntimeError("임시 차량 이동 불가")
        else:
            raise RuntimeError("경로 생성 불가")

    path_to_zone = astar(target_car, robot_zone, parking_map, occupied)
    path_back = astar(robot_zone, r['start'], parking_map, occupied)

    if path_to_car is None or path_to_zone is None or path_back is None:
        raise RuntimeError("로봇 경로 생성 불가")

    # 순차 경로 합치기
    full_path = path_to_car + path_to_zone + path_back
    all_robot_paths.append(full_path)
    temp_moves.append(temp_moved)
    print(f"[로봇 {i+1}] 경로 계산 완료. 길이: {len(full_path)}")

print(f"회수 차량: {target_car}, 목표 위치: {robot_zone}")
print("임시 이동 차량:", temp_moves)

# ------------------------
# 시각화
# ------------------------
fig, ax = plt.subplots(figsize=(cols*0.8, rows*1.6))
ax.set_xlim(0,cols)
ax.set_ylim(rows*cell_h,0)
ax.set_xticks([i+0.5 for i in range(cols)])
ax.set_yticks([i*cell_h+cell_h/2 for i in range(rows)])
ax.grid(True,color='lightgray',linewidth=0.5)

rects = {}
for r0 in range(rows):
    for c0 in range(cols):
        color = "limegreen" if parking_map[r0][c0]==1 else "lightgray"
        rect = plt.Rectangle((c0,r0*cell_h),cell_w,cell_h,facecolor=color,edgecolor='black')
        ax.add_patch(rect)
        rects[(r0,c0)] = rect

# 차량 표시
car_patches = {}
for pos in cars:
    cx,cy = cell_center(pos[0],pos[1])
    color = "yellow" if pos==target_car else "blue"
    patch = plt.Rectangle((cx-0.4,cy-0.6),0.8,1.2,facecolor=color,edgecolor="black")
    ax.add_patch(patch)
    car_patches[pos] = patch

# 로봇 표시
robot_markers = []
for r0 in robots:
    rx,ry = cell_center(r0['start'][0],r0['start'][1])
    marker, = ax.plot([rx],[ry], marker="o", color="red", markersize=12)
    robot_markers.append(marker)

# ------------------------
# 애니메이션
# ------------------------
max_len = max(len(p) for p in all_robot_paths)
frames = max_len

def update(frame):
    # 로봇 이동
    for r_idx, path in enumerate(all_robot_paths):
        if frame < len(path):
            pos = path[frame]
            x,y = cell_center(pos[0],pos[1])
            robot_markers[r_idx].set_data([x],[y])

    # 회수 차량 노란색
    if frame < len(all_robot_paths[0]):
        car_patches[target_car].set_xy(cell_center(all_robot_paths[0][min(frame,len(all_robot_paths[0])-1)][0],
                                                    all_robot_paths[0][min(frame,len(all_robot_paths[0])-1)][1]))
    return robot_markers + list(car_patches.values())

ani = animation.FuncAnimation(fig, update, frames=frames, interval=400, blit=True, repeat=False)
plt.title("Parking Robot 3 Units — 순차적 차량 회수")
plt.show()
