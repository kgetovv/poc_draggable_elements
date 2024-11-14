<script setup lang="ts">
import {ref} from 'vue';
import {vDraggable} from '@neodrag/vue';
import {QBtn, QDialog, QCard, QCardSection, QTable} from 'quasar';

interface Item {
  id: number;
  color: string;
}

interface ServerData {
  name: string;
  value: number;
  description: string;
}

const items = ref<Item[]>([]);
const colors = ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#D3BAFF'];
const dialog = ref(false);
const selectedItem = ref<Item | null>(null);

const columns: Array<any> = [
  {name: 'name', label: 'Name', field: 'name', required: true, align: 'left', sortable: true},
  {name: 'value', label: 'Value', field: 'value', align: 'center', sortable: true},
  {name: 'description', label: 'Description', field: 'description', align: 'left', sortable: true}
];

const data = ref<ServerData[]>([]);

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomId() {
  return Math.floor(Math.random() * 1000);
}

function addItem() {
  items.value.push({
    id: getRandomId(),
    color: getRandomColor(),
  });
}

function deleteItem(index: number) {
  items.value.splice(index, 1);
}

let isDragging = false;
let startX = 0;
let startY = 0;
let clickTimeout: number | null = null;

function handleMouseDown(event: MouseEvent) {
  isDragging = false;
  startX = event.clientX;
  startY = event.clientY;
  clickTimeout = window.setTimeout(() => {
    isDragging = true;
  }, 200); // 200ms delay to differentiate between click and drag
}

function handleMouseMove(event: MouseEvent) {
  if (clickTimeout) {
    clearTimeout(clickTimeout);
    clickTimeout = null;
  }
  const dx = event.clientX - startX;
  const dy = event.clientY - startY;
  if (Math.sqrt(dx * dx + dy * dy) > 5) {
    isDragging = true;
  }
}

function handleMouseUp(item: Item) {
  if (clickTimeout) {
    clearTimeout(clickTimeout);
    clickTimeout = null;
  }
  if (!isDragging) {
    openDialog(item);
  }
}

function handleDragStart(event: Event) {
  const target = event.target as HTMLElement;
  target.style.zIndex = '1000';
}

function handleDragEnd(event: Event) {
  const target = event.target as HTMLElement;
  target.style.zIndex = '100';
}

function fetchDataFromServer(id: number) {
  setTimeout(() => {
    const serverData: ServerData[] = [
      {name: `Item ${id}-1`, value: Math.floor(Math.random() * 100), description: `Description for item ${id}-1`},
      {name: `Item ${id}-2`, value: Math.floor(Math.random() * 100), description: `Description for item ${id}-2`}
    ];
    data.value.push(...serverData);
  }, 500); // Simulate a 500ms delay
}

function openDialog(item: Item) {
  selectedItem.value = item;
  dialog.value = true;
  fetchDataFromServer(item.id);
}

function closeDialog() {
  dialog.value = false;
  data.value = [];
}
</script>

<template>
  <div class="container">
    <div class="drag-area-container">
      <q-btn icon="add" @click="addItem" label="Add Item" color="primary"/>
      <div class="drag-area">
        <div
            v-for="(item, index) in items"
            :key="item.id"
            class="draggable-item"
            :style="{ backgroundColor: item.color }"
            v-draggable="{ axis: 'both', bounds: '.drop-area' }"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp(item)"
            @dragstart="handleDragStart"
            @dragend="handleDragEnd"
        >
          <q-btn icon="delete" flat round dense @click="deleteItem(index)"/>
          Item {{ item.id }}
        </div>
        Drag Area
      </div>
    </div>

    <!--    Drop zone is circular, but elements align only in rectangular formation due to vue draggable. An alternative is needed or function overload. -->
    <div class="drop-area q-mt-xl q-ml-xl">
      Drop Area
    </div>
  </div>

  <q-dialog v-model="dialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">Item ID: {{ selectedItem?.id }}</div>
        <div>Color: {{ selectedItem?.color }}</div>
      </q-card-section>
      <q-card-section>
        <q-table :rows="data" :columns="columns" row-key="name" binary-state-sort/>
      </q-card-section>
      <q-card-section>
        <q-btn icon="close" label="Close" color="primary" @click="closeDialog"/>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100vh;
}

.drag-area-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.drag-area {
  width: 200px;
  height: 300px;
  background-color: lightblue;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed blue;
  margin-top: 10px;
  position: relative;
}

.drop-area {
  width: 300px;
  height: 300px;
  background-color: lightgreen;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed green;
  border-radius: 50%;
  position: relative;
}

.draggable-item {
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
  border-radius: 50%;
  position: absolute;
  z-index: 100;
}
</style>