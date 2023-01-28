class Queue
{
  constructor()
  {
    this.arr = [];
  }

  Enqueue(item)
  {
    this.arr.push(item);
  }

  Dequeue()
  {
    return this.arr.shift();
  }

  IsEmpty()
  {
    return this.arr.length == 0 ? true : false;
  }
}

module.exports = Queue;