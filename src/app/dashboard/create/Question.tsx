import { useState, ChangeEvent } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit2, Save, X } from "lucide-react";

interface Question {
    id: number;
    type: 'mcq';
    options: [string, string, string, string];
    text: string;
    marks: number;
    time: number; // in minutes
    correctAnswer: number; // 0-3 for option A-D
    status?: 'old' | 'new';
}

interface QuestionsProps {
    index: number;
    question: Question;
    setQuestionText: (id: number, value: string) => void;
    setQuestionOption: (id: number, optionIndex: number, value: string) => void;
    setQuestionMarks: (id: number, value: number) => void;
    setQuestionTime: (id: number, value: number) => void;
    setCorrectAnswer: (id: number, value: number) => void;
    deleteQuestion: (questionIndex: number) => void;
}

export function Questions({
    index,
    question,
    setQuestionText,
    setQuestionOption,
    setQuestionMarks,
    setQuestionTime,
    setCorrectAnswer,
    deleteQuestion,
}: QuestionsProps) {
    const { id, text, options, marks, time, correctAnswer, status } = question;
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [tempText, setTempText] = useState<string>(text);
    const [tempOptions, setTempOptions] = useState<[string, string, string, string]>(options);
    const [tempMarks, setTempMarks] = useState<number>(marks);
    const [tempTime, setTempTime] = useState<number>(time);
    const [tempCorrectAnswer, setTempCorrectAnswer] = useState<number>(correctAnswer);

    const handleDelete = () => {
        if (status === 'old') {
            console.log('Delete old question with ID:', id);
        } else {
            deleteQuestion(index);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setTempText(text);
        setTempOptions(options);
        setTempMarks(marks);
        setTempTime(time);
        setTempCorrectAnswer(correctAnswer);
        setIsEditing(false);
    };

    const handleSave = () => {
        if (status === 'old') {
            console.log('Save old question with ID:', id);
        }
        setQuestionText(id, tempText);
        tempOptions.forEach((option, idx) => {
            setQuestionOption(id, idx, option);
        });
        setQuestionMarks(id, tempMarks);
        setQuestionTime(id, tempTime);
        setCorrectAnswer(id, tempCorrectAnswer);
        setIsEditing(false);
    };

    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (status === 'old' && !isEditing) {
            return;
        }
        if (isEditing) {
            setTempText(e.target.value);
        } else {
            setQuestionText(id, e.target.value);
        }
    };

    const handleOptionChange = (optionIndex: number, value: string) => {
        if (status === 'old' && !isEditing) {
            return;
        }
        if (isEditing) {
            const newOptions = [...tempOptions] as [string, string, string, string];
            newOptions[optionIndex] = value;
            setTempOptions(newOptions);
        } else {
            setQuestionOption(id, optionIndex, value);
        }
    };

    const handleMarksChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0;
        if (status === 'old' && !isEditing) {
            return;
        }
        if (isEditing) {
            setTempMarks(value);
        } else {
            setQuestionMarks(id, value);
        }
    };

    const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0;
        if (status === 'old' && !isEditing) {
            return;
        }
        if (isEditing) {
            setTempTime(value);
        } else {
            setQuestionTime(id, value);
        }
    };

    const handleAnswerChange = (value: string) => {
        const answerIndex = parseInt(value);
        if (status === 'old' && !isEditing) {
            return;
        }
        if (isEditing) {
            setTempCorrectAnswer(answerIndex);
        } else {
            setCorrectAnswer(id, answerIndex);
        }
    };

    return (
        <div className="mt-[10px] w-full flex flex-col border border-[#E2E2E2] justify-start drop-shadow-md rounded-md mb-4 pb-[15px]">
            {/* Question Header */}
            <div className="w-full min-h-[60px] flex justify-between items-center px-4">
                <div className="flex items-center gap-4">
                    <span className="font-semibold">{`Question ${index + 1}`}</span>
                    <span className="text-sm text-gray-600">MCQ</span>
                </div>
                <div className="flex gap-2">
                    {status === 'old' && !isEditing && (
                        <button
                            onClick={handleEdit}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <Edit2 className="w-5 h-5" />
                        </button>
                    )}
                    {status === 'old' && isEditing && (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                className="text-green-600 hover:text-green-800"
                            >
                                <Save className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleCancel}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                    <button
                        className="text-red-700 hover:text-red-900"
                        onClick={handleDelete}
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Time and Marks */}
            <div className="w-full px-4 mb-4">
                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Marks</label>
                        <input
                            type="number"
                            value={isEditing ? tempMarks : marks}
                            onChange={handleMarksChange}
                            disabled={status === 'old' && !isEditing}
                            className={`w-20 px-2 py-1 text-sm border rounded-md ${status === 'old' && !isEditing ? 'bg-gray-100' : 'bg-white'
                                } ${isEditing ? 'border-blue-500' : 'border-gray-300'}`}
                            min="0"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Time (min)</label>
                        <input
                            type="number"
                            value={isEditing ? tempTime : time}
                            onChange={handleTimeChange}
                            disabled={status === 'old' && !isEditing}
                            className={`w-20 px-2 py-1 text-sm border rounded-md ${status === 'old' && !isEditing ? 'bg-gray-100' : 'bg-white'
                                } ${isEditing ? 'border-blue-500' : 'border-gray-300'}`}
                            min="0"
                        />
                    </div>
                </div>
            </div>

            {/* Question Text */}
            <div className="w-full px-4 mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Question</label>
                <textarea
                    id={`question-${id}`}
                    rows={3}
                    value={isEditing ? tempText : text}
                    onChange={handleTextChange}
                    disabled={status === 'old' && !isEditing}
                    className={`p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border 
                        ${status === 'old' && !isEditing ? 'bg-gray-100' : 'bg-white'}
                        ${isEditing ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}
                        focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Write your question here."
                />
            </div>

            {/* Options */}
            <div className="w-full px-4 mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Options</label>
                <div className="space-y-2">
                    {(isEditing ? tempOptions : options).map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600 w-6">
                                {String.fromCharCode(65 + optionIndex)}.
                            </span>
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                                disabled={status === 'old' && !isEditing}
                                className={`flex-1 px-2 py-1 text-sm border rounded-md ${status === 'old' && !isEditing ? 'bg-gray-100' : 'bg-white'
                                    } ${isEditing ? 'border-blue-500' : 'border-gray-300'}`}
                                placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Correct Answer */}
            <div className="w-full px-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Correct Answer</label>
                <Select
                    value={String(isEditing ? tempCorrectAnswer : correctAnswer)}
                    onValueChange={handleAnswerChange}
                    disabled={status === 'old' && !isEditing}
                >
                    <SelectTrigger className={`w-32 ${status === 'old' && !isEditing ? 'bg-white' : 'bg-white'}`}>
                        <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Options</SelectLabel>
                            {options.map((option, idx) => (
                                <SelectItem key={idx} value={String(idx)}>
                                    {String.fromCharCode(65 + idx)} - {option.substring(0, 20)}...
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

export default Questions;