// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract NotesApp{
    struct Note{
        uint id;
        string ipfsHash;
        uint timestamp;
        address owner;
    }

    mapping(address => Note[]) private notes;
    uint private nextId;

    event NoteAdded(uint id, address indexed owner, string ipfsHash, uint timestamp);
    event NoteModified(uint id, address indexed owner, string newIpfsHash, uint timestamp);
    event NoteDeleted(uint id, address indexed owner, uint timestamp);

    function addNote(string memory ipfsHash) external {
        Note memory newNote = Note(nextId, ipfsHash, block.timestamp, msg.sender);
        notes[msg.sender].push(newNote);
        emit NoteAdded(nextId, msg.sender, ipfsHash, block.timestamp);
        nextId++;
    }

    function getMyNotes() external view returns (Note[] memory) {
        return notes[msg.sender];
    }

    function updateNote(uint id, string memory newIpfsHash) external {
        bool found = false;
        Note[] storage userNotes = notes[msg.sender];
        for(uint i = 0; i < userNotes.length; i++){
            if(userNotes[i].id == id){
                userNotes[i].ipfsHash = newIpfsHash;
                emit NoteModified(id, msg.sender, newIpfsHash, block.timestamp);
                found = true;
                break;
            }
        }
        require(found, "Note not found");
    }

    function deleteNote(uint id) external{
        bool found = false;
        Note[] storage userNotes = notes[msg.sender];
        for(uint i = 0; i < userNotes.length; i++){
            if(userNotes[i].id == id){
                userNotes[i] = userNotes[userNotes.length-1];
                userNotes.pop();
                emit NoteDeleted(id, msg.sender, block.timestamp);
                found = true;
                break;
            }
        }
        require(found, "Note not found");
    }

}