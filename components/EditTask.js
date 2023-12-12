import { collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";

import { useContext, useState } from "react";

import { FaRegSave } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { ImRadioUnchecked } from "react-icons/im";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";

import { authContext } from "@/store/auth";
import { tasksContext } from "@/store/tasks";

import authclasses from "../styles/auth.module.css";
import taskclasses from "../styles/task.module.css";

const EditTask = ({ proptask, removeContainer }) => {
    const { authState } = useContext(authContext);
    const { tasksDispatch } = useContext(tasksContext);
    const [task, setTask] = useState({ ...proptask });

    const handlechange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setTask(prev => ({ ...prev, [name]: value }));
    }

    const handler = async (dispatchType, params) => {
        await setDoc(doc(collection(db, authState.uid), params.uid || task.assignTime), { ...params })
            .then(() => {
                tasksDispatch({
                    type: dispatchType,
                    payload: { task }
                });
                removeContainer();
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleDelete = async () => {
        await deleteDoc(doc(db, authState.uid, task.uid || task.assignTime))
            .then(() => {
                tasksDispatch({
                    type: "DELETETASK",
                    payload: { task }
                });
                removeContainer();
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <div className="globalBox">
            <div className={taskclasses.container}>
                <div className={authclasses.form}>
                    <div className={authclasses.group} >
                        <label htmlFor="title">Title</label>
                        <input
                            disabled={task.isBinned}
                            type="text"
                            id='title'
                            name='title'
                            placeholder='Enter title'
                            value={task.title || ''}
                            onChange={(e) => handlechange(e)} />
                    </div>
                    <div className={authclasses.group} >
                        <label htmlFor="detail">Details</label>
                        <textarea
                            disabled={task.isBinned}
                            cols={5}
                            rows={5}
                            id='detail'
                            name='detail'
                            placeholder='Enter detail'
                            value={task.detail || ''}
                            onChange={(e) => handlechange(e)} />
                    </div>
                    <div className={taskclasses.group} >
                        <div className={authclasses.group}>
                            <label htmlFor="duedate">Duedate</label>
                            <input
                                disabled={task.isBinned}
                                type='date'
                                id='duedate'
                                name='duedate'
                                placeholder='Enter duedate'
                                value={task.duedate || ''}
                                onChange={(e) => handlechange(e)} />
                        </div>

                        {!task.isBinned ?
                            <>
                                <button className='round long blue' onClick={() => handler("UPDATETASK", { ...task })}><FaRegSave />save</button>
                                {task.status !== "complete"
                                    ? <button className='round long green' onClick={() => handler("UPDATETASK", { ...task, status: "complete" })}><FaRegCheckCircle />check</button>
                                    : <button className='round long blue' onClick={() => handler("UPDATETASK", { ...task, status: "todo" })}><ImRadioUnchecked />uncheck</button>
                                }
                                <button className='round long red' onClick={() => handler("UPDATETASK", { ...task, isBinned: true })}><MdDeleteOutline />bin</button>
                            </> :
                            <>
                                <button className='round long blue' onClick={() => handler("UPDATETASK", { ...task, isBinned: false })}><FaRegSave />restore</button>
                                <button className='round long red' onClick={handleDelete}><FaRegSave />delete</button>
                            </>
                        }

                        <button className='round long red' onClick={() => removeContainer()}><FaXmark />close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditTask;