"use client";

import { FC, useState, useEffect, useRef } from 'react';
import { SmilePlus, Image, ChevronDown, X } from 'lucide-react';

interface CreateFeedbackModalProps {
  isOpen: boolean;
  slug:string;
  onClose: () => void;
  onSubmit: (title: string, description: string, label: string) => void;
}

const LABELS = [
  { id: 'bug', name: 'Bug', color: '#F87171' },
  { id: 'feature', name: 'Feature', color: '#60A5FA' },
  { id: 'improvement', name: 'Improvement', color: '#34D399' },
];

const CreateFeedbackModal: FC<CreateFeedbackModalProps> = ({
  isOpen,
  slug,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLabel, setSelectedLabel] = useState(LABELS[0]);
  const [isLabelDropdownOpen, setIsLabelDropdownOpen] = useState(false);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setTimeout(() => {
        if (titleRef.current) {
          titleRef.current.focus();
        }
      }, 0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setTitle('');
    setDescription('');
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(title, description, selectedLabel.id);
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg relative">
        {/* Close button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="px-20 py-10">
          <div className="flex items-center gap-3 mb-6">
            <button>
              <SmilePlus className="w-4 h-4 text-gray-400" />
            </button>
            <button>
              <Image className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="mb-4">
            <textarea
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full text-2xl text-gray-700 font-medium focus:outline-none resize-none overflow-hidden placeholder:text-gray-400"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  descriptionRef.current?.focus();
                }
              }}
              style={{ height: 'auto' }}
            />
          </div>

          <div className="relative mb-4">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>Feedback</span>
              <span>•</span>
              <button 
                onClick={() => setIsLabelDropdownOpen(!isLabelDropdownOpen)}
                className="flex items-center gap-2 hover:text-gray-700"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: selectedLabel.color }}
                />
                <span>{selectedLabel.name}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {isLabelDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg py-1 min-w-[120px] z-10">
                {LABELS.map((label) => (
                  <button
                    key={label.id}
                    onClick={() => {
                      setSelectedLabel(label);
                      setIsLabelDropdownOpen(false);
                    }}
                    className={`flex items-center gap-2 w-full px-3 py-1.5 text-sm hover:bg-gray-50 ${
                      selectedLabel.id === label.id ? 'text-black' : 'text-gray-600'
                    }`}
                  >
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: label.color }}
                    />
                    <span>{label.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <textarea
            ref={descriptionRef}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="You can use markdown to format text, like # for headings, * for bullets, and [] for checkboxes"
            className="w-full min-h-[200px] text-sm text-gray-700 focus:outline-none resize-none placeholder:text-gray-400"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end px-4 py-3 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              title.trim() 
                ? 'bg-black text-white hover:bg-gray-900' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Submit feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFeedbackModal;
